<script setup>
import { computed, nextTick, ref } from 'vue'
import { data as catalog } from '../pages.data.mjs'
import { library, setProgress } from '../state.mjs'
import { nextMilestone } from '../content-tools.mjs'

const props = defineProps({ chapter: { type: Object, required: true } })
const next = computed(() => nextMilestone(props.chapter, library.progress))
const message = ref('')
const status = ref(null)

async function advance() {
  const milestone = next.value
  if (!milestone) return
  const y = window.scrollY
  setProgress({ ...library.progress, [props.chapter.chapterId]: milestone.id }, catalog.chapters)
  message.value = 'Your place is saved.'
  await nextTick()
  if (!next.value) status.value?.focus({ preventScroll: true })
  // Revealing passages (including replacements using `until`) must not pull
  // the viewport down with this control as its position in the page changes.
  window.scrollTo({ top: y, behavior: 'instant' })
}
</script>

<template>
  <section v-if="library.ready && chapter.milestones.length > 1" class="in-page-progress" aria-label="Chapter story progress">
    <template v-if="next">
      <p class="eyebrow">Your next story milestone</p>
      <p class="milestone-prompt">When you’ve reached this point in your adventure:</p>
      <p class="milestone-title">{{ next.title }}</p>
      <div class="settings-actions"><button type="button" class="primary" @click="advance">Reached this point</button><a href="/progress.html">Adjust progress</a></div>
    </template>
    <p v-else class="milestone-prompt">You’re up to date with this chapter. <a href="/progress.html">Adjust progress</a></p>
    <p ref="status" role="status" tabindex="-1" class="save-status">{{ message }}</p>
  </section>
</template>
