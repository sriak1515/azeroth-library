const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function plainText(source = '') {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/<[^>]+>/g, ' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_`>|]/g, ' ').replace(/\s+/g, ' ').trim()
}
export function normalizeProgress(progress = {}, chapters = []) {
  return Object.fromEntries(chapters.map(chapter => {
    const saved = progress?.[chapter.chapterId]
    return [chapter.chapterId, chapter.milestones.some(m => m.id === saved) ? saved : chapter.milestones[0].id]
  }))
}
export function milestoneIndex(chapterId, milestone, chapters) {
  const chapter = chapters.find(c => c.chapterId === chapterId)
  return chapter ? chapter.milestones.findIndex(m => m.id === milestone) : -1
}
export function isKnown(record, progress = {}, chapters = []) {
  for (const [chapterId, milestone] of Object.entries(record.requires || {})) {
    const required = milestoneIndex(chapterId, milestone, chapters)
    const chapter = chapters.find(c => c.chapterId === chapterId)
    const reached = milestoneIndex(chapterId, progress[chapterId] || chapter?.milestones[0]?.id, chapters)
    if (required < 0 || reached < required) return false
  }
  for (const [chapterId, milestone] of Object.entries(record.before || {})) {
    const until = milestoneIndex(chapterId, milestone, chapters)
    const chapter = chapters.find(c => c.chapterId === chapterId)
    const reached = milestoneIndex(chapterId, progress[chapterId] || chapter?.milestones[0]?.id, chapters)
    if (until < 0 || reached < 0 || reached >= until) return false
  }
  return true
}

// A passage names a stable milestone; its chapter defaults to the page's chapterId.
export function storyParts(source, defaultChapter) {
  const gates = []
  let count = 0
  const base = source.replace(/<StoryGate\s+([^>]+)>([\s\S]*?)<\/StoryGate>/g, (_, attrs, text) => {
    count++
    if (/<StoryGate\b/.test(text)) throw new Error('Nested StoryGate blocks are not supported.')
    const get = name => attrs.match(new RegExp('(?:^|\\s)' + name + '=["\']([^"\']+)["\']'))?.[1]
    const chapter = get('chapter') || defaultChapter
    const milestone = get('milestone')
    if (!chapter || !milestone || !identifier.test(chapter) || !identifier.test(milestone)) throw new Error('StoryGate needs a chapterId and a stable milestone name, e.g. milestone="met-oben".')
    const until = get('until')
    if (until && !identifier.test(until)) throw new Error('StoryGate until must name a stable milestone.')
    gates.push({ text: plainText(text), requires: { [chapter]: milestone }, before: until ? { [chapter]: until } : {} })
    return ''
  })
  if ((source.match(/<StoryGate\b/g) || []).length !== count || /<\/?StoryGate\b/.test(base)) throw new Error('A StoryGate block is unclosed or malformed.')
  return [{ text: plainText(base), requires: {}, before: {} }, ...gates]
}

export function buildCatalog(rawPages) {
  const pages = rawPages.map(page => {
    const f = page.frontmatter || {}
    if (!f.title || typeof f.title !== 'string') throw new Error(`${page.url}: add a title to the Markdown frontmatter.`)
    if ('minMilestone' in f) throw new Error(`${page.url}: use chapter-specific requires instead of minMilestone.`)
    const layout = f.layout || 'reference'
    if (!['lore', 'reference', 'glossary', 'glossary-index', 'settings'].includes(layout)) throw new Error(`${page.url}: unknown layout ${layout}.`)
    const chapterId = f.chapterId || null
    let milestones = []
    if (layout === 'lore') {
      if (!chapterId || !identifier.test(chapterId)) throw new Error(`${page.url}: lore pages need a unique chapterId such as kal-01-shadowglen.`)
      if (!Number.isFinite(f.order)) throw new Error(`${page.url}: lore pages need a numeric order.`)
      milestones = f.milestones || [{ id: 'start', title: 'At the beginning', description: '' }]
      if (!Array.isArray(milestones) || !milestones.length || milestones.some(m => !m || !identifier.test(m.id || '') || !m.title)) throw new Error(`${page.url}: each milestone needs an id and title.`)
      if (new Set(milestones.map(m => m.id)).size !== milestones.length) throw new Error(`${page.url}: milestone IDs must be unique within this chapter.`)
    }
    if (!f.requires || typeof f.requires !== 'object' || Array.isArray(f.requires)) {
      if (f.requires !== undefined) throw new Error(`${page.url}: requires must map chapter IDs to milestone IDs.`)
    }
    return { url: page.url, title: f.entryTitle || f.title, description: f.description || '', kind: f.kind || '', layout,
      group: f.group || (layout === 'lore' ? 'chronicle' : ''), search: f.search !== false,
      chapterId, order: f.order ?? null, navTitle: f.navTitle || f.title, chapterNumber: f.chapterNumber || '',
      zone: f.zone || '', region: f.region || '', volume: f.volume || '', volumeNumber: f.volumeNumber || '',
      requires: f.requires || {}, milestones, introducedIn: f.introducedIn || null,
      parts: storyParts(page.src || '', chapterId) }
  })
  const chapters = pages.filter(p => p.layout === 'lore').sort((a, b) => a.order - b.order)
  if (new Set(chapters.map(c => c.chapterId)).size !== chapters.length) throw new Error('Every lore page needs a different chapterId.')
  if (new Set(chapters.map(c => c.order)).size !== chapters.length) throw new Error('Chapter order values must be unique.')
  for (const page of pages) {
    for (const record of [page, ...page.parts]) {
      for (const mapping of [record.requires, record.before]) for (const [id, milestone] of Object.entries(mapping || {})) {
        if (milestoneIndex(id, milestone, chapters) < 0) throw new Error(`${page.url}: unknown milestone ${id}/${milestone}. Check the chapter's milestones list.`)
      }
      for (const [id, until] of Object.entries(record.before || {})) if (record.requires?.[id] && milestoneIndex(id, until, chapters) <= milestoneIndex(id, record.requires[id], chapters)) throw new Error(`${page.url}: until must come after milestone.`)
    }
    if (page.introducedIn && !chapters.some(c => c.chapterId === page.introducedIn)) throw new Error(`${page.url}: introducedIn names an unknown chapter.`)
  }
  return { pages, chapters }
}

export function migratePreferences(saved, legacy, chapters) {
  const source = saved || legacy || {}
  const progress = { ...(saved?.progress || {}) }
  if (!saved && legacy) {
    const chapter = chapters.find(c => c.chapterId === 'kal-02-banethil')
    const ids = ['barrow-entrance', 'met-oben', 'charm-examined']
    const stage = Number(legacy.stage)
    const id = ids[Number.isInteger(stage) && stage >= 0 && stage <= 2 ? stage : 0]
    if (chapter?.milestones.some(m => m.id === id)) progress[chapter.chapterId] = id
  }
  return { theme: source.theme === 'stone' ? 'stone' : 'parchment',
    size: [19, 21, 24].includes(Number(source.size)) ? Number(source.size) : 21,
    progress: normalizeProgress(progress, chapters) }
}
