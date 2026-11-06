import { reactive, readonly } from 'vue'
import { migratePreferences, normalizeProgress } from './content-tools.mjs'
const state = reactive({ ready: false, theme: 'parchment', progress: {}, size: 21 })
const key = 'azeroth-library-pilot-v2'
export const library = readonly(state)
function persist() { try { localStorage.setItem(key, JSON.stringify({ theme: state.theme, progress: state.progress, size: state.size })) } catch {} }
function read(key) { try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null } }
export function initializeState(chapters) {
  if (state.ready || typeof window === 'undefined') return
  Object.assign(state, migratePreferences(read(key), read('azeroth-library-pilot-v1'), chapters))
  state.ready = true
  persist()
}
export function setTheme(theme) { state.theme = theme === 'stone' ? 'stone' : 'parchment'; persist() }
export function setProgress(progress, chapters) { state.progress = normalizeProgress(progress, chapters); persist() }
export function setSize(size) { state.size = [19, 21, 24].includes(Number(size)) ? Number(size) : 21; persist() }
