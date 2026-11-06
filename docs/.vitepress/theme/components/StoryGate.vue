<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as catalog } from '../pages.data.mjs'
import { library } from '../state.mjs'
import { isKnown } from '../content-tools.mjs'
const { frontmatter } = useData()
const props = defineProps({ milestone: { type: String, required: true }, chapter: { type: String, default: '' }, until: { type: String, default: '' } })
const visible = computed(() => {
  const id = props.chapter || frontmatter.value.chapterId
  return library.ready && isKnown({ requires: { [id]: props.milestone }, before: props.until ? { [id]: props.until } : {} }, library.progress, catalog.chapters)
})
</script>
<template><section v-if="visible" class="story-section"><slot /></section></template>
