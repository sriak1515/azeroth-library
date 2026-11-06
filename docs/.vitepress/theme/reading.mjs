import { reactive } from 'vue'

export const reading = reactive({ path: '/', y: 0 })
let isLore = false
export function initializeReading(chapters) {
  try { const saved = JSON.parse(sessionStorage.getItem('azeroth-library-reading') || 'null'); if (chapters.some(c => c.url === saved?.path) && Number.isFinite(saved.y)) Object.assign(reading, saved) } catch {}
}
export function trackReading(router, chapters) {
  initializeReading(chapters)
  const capture = () => {
    if (!isLore || router.route.data.frontmatter.layout !== 'lore') return
    reading.path = location.pathname
    reading.y = window.scrollY
    try { sessionStorage.setItem('azeroth-library-reading', JSON.stringify(reading)) } catch {}
  }
  const update = () => { isLore = router.route.data.frontmatter.layout === 'lore' }
  update()
  window.addEventListener('scroll', capture, { passive: true })
  const previousBefore = router.onBeforeRouteChange
  const previousAfter = router.onAfterRouteChange
  router.onBeforeRouteChange = async to => { capture(); isLore = false; return previousBefore?.(to) }
  router.onAfterRouteChange = async to => { await previousAfter?.(to); requestAnimationFrame(() => requestAnimationFrame(update)) }
  return () => window.removeEventListener('scroll', capture)
}
export async function returnToReading(event, router) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  const y = reading.y
  await router.go(reading.path)
  requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' })))
}
