import { createContentLoader } from 'vitepress'
import { buildCatalog } from './content-tools.mjs'
export default createContentLoader('**/*.md', { includeSrc: true, transform: buildCatalog })
