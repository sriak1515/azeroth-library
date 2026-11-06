<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRouter } from 'vitepress'
import { data as catalog } from './pages.data.mjs'
import { library, initializeState, setTheme } from './state.mjs'
import { isKnown } from './content-tools.mjs'
import { reading, returnToReading, trackReading } from './reading.mjs'

const { page, frontmatter } = useData()
const router = useRouter()
const outline = ref([])
const lore = computed(() => frontmatter.value.layout === 'lore')
const glossary = computed(() => frontmatter.value.layout === 'glossary')
const known = computed(() => (!Object.keys(frontmatter.value.requires || {}).length || library.ready) && isKnown(frontmatter.value, library.progress, catalog.chapters))
const displayTitle = computed(() => !known.value ? 'A page still to be written' : frontmatter.value.entryTitle || frontmatter.value.title || 'Azeroth Library')
const activeGroup = computed(() => lore.value ? 'chronicle' : glossary.value || frontmatter.value.layout === 'glossary-index' ? 'glossary' : frontmatter.value.group)
const visibleChapters = computed(() => catalog.chapters.filter(c => isKnown(c, library.progress, catalog.chapters)))
const currentChapter = computed(() => catalog.chapters.find(c => c.chapterId === frontmatter.value.chapterId))
const currentRecord = computed(() => catalog.pages.find(p => p.url === router.route.path))
const chapterPosition = computed(() => visibleChapters.value.findIndex(c => c.chapterId === currentChapter.value?.chapterId))
const previousChapter = computed(() => chapterPosition.value > 0 ? visibleChapters.value[chapterPosition.value - 1] : null)
const nextChapter = computed(() => chapterPosition.value >= 0 ? visibleChapters.value[chapterPosition.value + 1] : null)
const introduced = computed(() => catalog.chapters.find(c => c.chapterId === frontmatter.value.introducedIn && isKnown(c, library.progress, catalog.chapters)))
const hasUnrevealed = computed(() => currentRecord.value?.parts.some(part => !isKnown({ requires: part.requires }, library.progress, catalog.chapters)))
const collection = computed(() => frontmatter.value.collection || 'The Chronicle')
const number = chapter => chapter?.chapterNumber || String(chapter?.order || '').padStart(2, '0')
const navigation = [ ['Chronicle', '/', 'chronicle'], ['Druid playbook', '/guides/druid.html', 'guide'], ['Glossary', '/glossary/', 'glossary'], ['Troubleshooting', '/help/altbot.html', 'help'] ]
let stopReading
async function collectOutline() {
  await nextTick()
  outline.value = [...document.querySelectorAll('.md-body h2[id]')].filter(el => el.getClientRects().length).map(el => ({ title: el.textContent.replace(/\s*#$/, ''), id: el.id }))
}
onMounted(() => { initializeState(catalog.chapters); stopReading = trackReading(router, catalog.chapters); collectOutline() })
onUnmounted(() => stopReading?.())
watch(() => [page.value.relativePath, page.value.headers, library.progress, catalog.chapters], () => { if (typeof document !== 'undefined') collectOutline() }, { flush: 'post', deep: true })
watch(displayTitle, title => { if (typeof document !== 'undefined') document.title = title + ' · Azeroth Library' })
</script>

<template>
  <div id="az-app" :data-theme="library.theme" :style="{ '--body-size': library.size + 'px' }">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="topbar">
      <a class="brand" href="/" aria-label="Azeroth Library home"><span class="sigil" aria-hidden="true">☽</span><span class="brand-name">Azeroth Library<small>A solo adventurer’s companion</small></span></a>
      <nav class="topnav" aria-label="Main navigation"><a v-for="[label, href, group] in navigation" :key="href" :href="href" :aria-current="activeGroup === group ? 'page' : undefined">{{ label }}</a></nav>
      <div class="toolbar"><a class="search-trigger" href="/search.html" aria-label="Search library">⌕ <span>Search</span></a><div class="theme-switch" aria-label="Appearance"><button :aria-pressed="library.theme === 'parchment'" @click="setTheme('parchment')">Parchment</button><button :aria-pressed="library.theme === 'stone'" @click="setTheme('stone')">Stone</button></div></div>
    </header>
    <div class="layout">
      <aside class="sidebar" aria-label="Chapter navigation">
        <div v-if="lore" class="volume-label"><span class="volume-number">{{ frontmatter.volumeNumber || '✧' }}</span><div><small>{{ collection }}</small><strong>{{ frontmatter.volume || 'Your chapters' }}</strong></div></div>
        <div v-else class="volume-label"><span class="volume-number">✧</span><div><small>The adventurer’s companion</small><strong>Field reference</strong></div></div>
        <nav v-if="lore" class="chapter-list" aria-label="Your chapters"><p class="eyebrow">Your chapters</p><a v-for="chapter in visibleChapters" :key="chapter.chapterId" class="chapter" :class="{ active: chapter.chapterId === currentChapter?.chapterId }" :href="chapter.url" :aria-current="chapter.chapterId === currentChapter?.chapterId ? 'page' : undefined"><span>{{ number(chapter) }}</span><span>{{ chapter.navTitle }}<small>{{ chapter.zone }}{{ chapter.chapterId === currentChapter?.chapterId ? (chapter.zone ? ' · Reading now' : 'Reading now') : '' }}</small></span></a></nav>
        <nav v-if="lore && outline.length" class="side-sections" aria-label="In this chapter"><p class="eyebrow">In this chapter</p><a v-for="heading in outline" :key="heading.id" :href="'#' + heading.id">{{ heading.title }}</a></nav>
        <nav v-else-if="!lore" class="side-sections" aria-label="Reference pages"><p class="eyebrow">Within reach</p><a href="/guides/druid.html">Thaloren’s druid playbook</a><a href="/glossary/">The growing glossary</a><a href="/help/altbot.html">A little practical help</a><a :href="reading.path">Return to the chronicle →</a></nav>
        <p class="side-foot">A place for the things<br>worth remembering.<span>Thaloren’s journey</span></p>
      </aside>
      <main class="main" id="main-content">
        <div class="crumbbar"><div class="breadcrumbs"><template v-if="lore"><a href="/">{{ frontmatter.region || 'Chronicle' }}</a><template v-if="frontmatter.zone"><span>/</span><span>{{ frontmatter.zone }}</span></template><span>/</span><b>{{ frontmatter.shortTitle || displayTitle }}</b></template><template v-else-if="glossary"><a href="/glossary/">Glossary</a><span>/</span><b>{{ known ? displayTitle : 'Unwritten' }}</b></template><template v-else><span>The adventurer’s companion</span><span>/</span><b>{{ frontmatter.shortTitle || displayTitle }}</b></template></div><div class="reading-links"><a href="/progress.html" class="progress-link">Story progress</a><a href="/preferences.html" class="reader-button" aria-label="Reading preferences">Aa</a></div></div>
        <template v-if="page.isNotFound"><header class="page-heading"><p class="eyebrow">A turn in the road</p><h1>That page isn’t here.</h1><p><a href="/">Return to the chronicle.</a></p></header></template>
        <template v-else-if="!known"><header class="page-heading"><p class="eyebrow">The unwritten road</p><h1>A page still to be written</h1><p>This entry is not yet part of your story.</p></header><div class="settings-page"><a href="/glossary/">Return to your glossary</a></div></template>
        <template v-else>
          <template v-if="lore"><div class="hero"><div class="hero-top"><span>{{ collection }} / Chapter {{ number(currentChapter) }}</span><span aria-hidden="true">✧</span></div><div class="chapter-seal" aria-hidden="true"><span>☽</span><small>{{ frontmatter.zone || 'The Chronicle' }}</small></div><div class="hero-content"><p class="eyebrow">{{ [frontmatter.zone, frontmatter.navTitle].filter(Boolean).join(' · ') || collection }}</p><h1>{{ frontmatter.heroTitle || displayTitle }}</h1><p class="hero-subtitle">{{ frontmatter.description }}</p><div class="hero-meta"><span>A chapter in Thaloren’s journey</span><span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }}</span></div></div></div><div v-if="frontmatter.ribbon" class="chapter-ribbon"><p>{{ frontmatter.ribbon }}</p><span>{{ frontmatter.zone }} · {{ number(currentChapter) }}</span></div></template>
          <nav v-if="glossary" class="entry-navigation" aria-label="Glossary navigation"><a class="vp-raw" :href="reading.path" @click="returnToReading($event, router)">← Back to your passage</a><a href="/glossary/">All glossary entries</a></nav>
          <header v-if="!lore" class="page-heading" :class="{ 'entry-heading': glossary }"><p class="eyebrow">{{ frontmatter.kind }}</p><h1>{{ displayTitle }}</h1><p v-if="frontmatter.description">{{ frontmatter.description }}</p></header>
          <div :class="['content-wrap', frontmatter.layout, { 'prose': lore || glossary, 'practical-content': !lore && !glossary }]">
            <Content class="md-body" />
            <p v-if="lore && hasUnrevealed" class="chapter-pause">There is more to this chapter as you reach its story milestones.</p>
            <div v-if="glossary" class="entry-ending"><p v-if="introduced">First encountered in <a :href="introduced.url">{{ introduced.title }}</a>.</p><a class="vp-raw return-reading" :href="reading.path" @click="returnToReading($event, router)">← Return to your reading</a></div>
            <nav v-if="lore && (previousChapter || nextChapter)" class="chapter-pagination" aria-label="More chapters"><a v-if="previousChapter" :href="previousChapter.url"><small>Previous chapter</small>← {{ previousChapter.navTitle }}</a><span v-else></span><a v-if="nextChapter" :href="nextChapter.url"><small>Next chapter</small>{{ nextChapter.navTitle }} →</a></nav>
          </div>
          <footer class="chapter-footer"><span>{{ lore ? collection + ' · ' + number(currentChapter) : 'Azeroth Library' }}</span><span>Thaloren’s journey</span></footer>
        </template>
      </main>
    </div>
  </div>
</template>
