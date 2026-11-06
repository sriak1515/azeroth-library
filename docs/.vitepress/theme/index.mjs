import Layout from './Layout.vue'
import StoryGate from './components/StoryGate.vue'
import GlossaryIndex from './components/GlossaryIndex.vue'
import ProgressSettings from './components/ProgressSettings.vue'
import ReadingSettings from './components/ReadingSettings.vue'
import LibrarySearch from './components/LibrarySearch.vue'
import './style.css'

export default {
  Layout,
  enhanceApp({ app }) {
    for (const [name, component] of Object.entries({ StoryGate, GlossaryIndex, ProgressSettings, ReadingSettings, LibrarySearch })) app.component(name, component)
  }
}
