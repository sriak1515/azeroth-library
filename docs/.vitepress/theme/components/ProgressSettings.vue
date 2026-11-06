<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vitepress'
import { data as catalog } from '../pages.data.mjs'
import { library, setProgress } from '../state.mjs'
import { isKnown, normalizeProgress } from '../content-tools.mjs'
import { reading, returnToReading } from '../reading.mjs'
const router = useRouter()
const selected = ref({})
const message = ref('')
const chapters = computed(() => catalog.chapters.filter(c => isKnown(c, library.progress, catalog.chapters)))
watch(() => [library.ready, library.progress, catalog.chapters], () => { selected.value = normalizeProgress(library.progress, catalog.chapters) }, { immediate: true, deep: true })
function save() { setProgress(selected.value, catalog.chapters); message.value = 'Your place is saved. The chronicle and glossary are up to date.' }
</script>
<template>
  <form class="progress-form" @submit.prevent="save">
    <fieldset v-for="chapter in chapters" :key="chapter.chapterId" class="chapter-progress"><legend>{{ chapter.title }}</legend><p class="eyebrow" v-if="chapter.zone">{{ chapter.zone }}</p>
      <label v-for="milestone in chapter.milestones" :key="milestone.id" class="milestone-option"><input v-model="selected[chapter.chapterId]" type="radio" :name="chapter.chapterId" :value="milestone.id"><span><strong>{{ milestone.title }}</strong><small v-if="milestone.description">{{ milestone.description }}</small></span></label>
    </fieldset>
    <div class="settings-actions"><button class="primary" type="submit">Save my place</button><a class="vp-raw" :href="reading.path" @click="returnToReading($event, router)">Back to your passage</a></div><p class="save-status" role="status">{{ message }}</p>
  </form>
</template>
