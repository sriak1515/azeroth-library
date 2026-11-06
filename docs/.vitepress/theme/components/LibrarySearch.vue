<script setup>
import { computed, ref } from 'vue'
import { data as catalog } from '../pages.data.mjs'
import { library } from '../state.mjs'
import { isKnown } from '../content-tools.mjs'
const query = ref('')
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  return catalog.pages.filter(page => page.search && isKnown(page, library.progress, catalog.chapters)).filter(page => {
    const text = [page.title, page.description, page.kind, ...page.parts.filter(part => isKnown(part, library.progress, catalog.chapters)).map(part => part.text)].join(' ')
    return text.toLowerCase().includes(q)
  })
})
</script>
<template>
  <input v-model="query" class="input" type="search" aria-label="Search discovered pages" placeholder="A chapter, a name, a little help…">
  <div class="results" aria-live="polite"><a v-for="page in results" :key="page.url" class="result" :href="page.url">{{ page.title }}<small>{{ page.kind }}</small></a><p v-if="!results.length" class="empty">No matches in your discovered pages.</p></div>
  <p class="source-line">Only discovered pages and passages appear.</p>
</template>
