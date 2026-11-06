<script setup>
import { computed, ref } from 'vue'
import { data as catalog } from '../pages.data.mjs'
import { library } from '../state.mjs'
import { isKnown } from '../content-tools.mjs'
const query = ref('')
const known = computed(() => catalog.pages.filter(p => p.layout === 'glossary' && isKnown(p, library.progress, catalog.chapters)).sort((a, b) => a.title.localeCompare(b.title)))
const filtered = computed(() => known.value.filter(p => (p.title + ' ' + p.description + ' ' + p.kind).toLowerCase().includes(query.value.trim().toLowerCase())))
</script>
<template>
  <div class="lexicon-controls"><input v-model="query" type="search" class="input" aria-label="Filter discovered glossary entries" placeholder="Find a name, place or idea…"><span class="entry-count">{{ known.length }} discovered entries</span></div>
  <div class="lexicon-list">
    <a v-for="page in filtered" :key="page.url" :href="page.url" class="lexicon-entry"><span class="letter">{{ page.title[0] }}</span><div><h2>{{ page.title }}</h2><p>{{ page.description }}</p><span class="eyebrow">{{ page.kind }}</span></div></a>
    <p class="unwritten">{{ filtered.length ? 'Later discoveries remain unnamed.' : 'No discovered entries match that search.' }}</p>
  </div>
</template>
