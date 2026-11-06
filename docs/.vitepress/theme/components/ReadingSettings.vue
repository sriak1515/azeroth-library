<script setup>
import { library, setSize } from '../state.mjs'
import { reading, returnToReading } from '../reading.mjs'
import { useRouter } from 'vitepress'
const router = useRouter()
</script>
<template>
  <p class="eyebrow">Text size</p><div class="size-options"><button v-for="(label, i) in ['Compact', 'Comfortable', 'Generous']" :key="label" :aria-pressed="library.size === [19, 21, 24][i]" @click="setSize([19, 21, 24][i])">{{ label }}</button></div>
  <p class="settings-description">Your choice applies to lore chapters and glossary pages.</p><a class="vp-raw return-reading" :href="reading.path" @click="returnToReading($event, router)">← Return to your reading</a>
</template>
