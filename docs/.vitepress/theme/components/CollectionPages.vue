<script setup>
import { computed } from 'vue'
import { data as catalog } from '../pages.data.mjs'
import { library } from '../state.mjs'
import { isKnown } from '../content-tools.mjs'
const props = defineProps({ chapters: Boolean })
const pages = computed(() => (props.chapters ? catalog.chapters : catalog.pages.filter(p => p.layout === 'reference' && p.search)).filter(p => isKnown(p, library.progress, catalog.chapters)))
</script>
<template>
  <div class="results"><a v-for="page in pages" :key="page.url" class="result" :href="page.url">{{ page.navTitle }}<small>{{ page.description }}</small></a><p v-if="!pages.length">{{ chapters ? 'No chapters are available yet.' : 'No reference pages are available yet.' }}</p></div>
  <p v-if="chapters"><a href="/reference.html">Guides and practical help →</a></p>
</template>
