import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Azeroth Library',
  description: 'Thaloren’s local chronicle and practical companion.',
  lang: 'en',
  cleanUrls: false,
  appearance: false,
  lastUpdated: false,
  markdown: { anchor: { permalink: false } },
  vite: { server: { allowedHosts: ['terminal.local', 'localhost', '127.0.0.1'] } },
  head: [['meta', { name: 'theme-color', content: '#f5eedf' }]],
  themeConfig: {}
})
