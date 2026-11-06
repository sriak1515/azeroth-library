import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative, sep } from 'node:path'
import matter from 'gray-matter'

export async function loadSourcePages(docs) {
  const files = []
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue
      const path = resolve(dir, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (entry.name.endsWith('.md')) files.push(path)
    }
  }
  await walk(docs)
  return Promise.all(files.sort().map(async file => {
    const src = await readFile(file, 'utf8')
    const path = relative(docs, file).split(sep).join('/')
    const url = '/' + path.replace(/(?:^|\/)index\.md$/, match => match.startsWith('/') ? '/' : '').replace(/\.md$/, '.html')
    return { file, url, src, frontmatter: matter(src).data }
  }))
}
