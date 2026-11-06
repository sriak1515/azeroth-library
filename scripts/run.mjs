import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { stageContent, projectRoot } from './stage.mjs'
import { checkContent } from './check-content.mjs'

if (Number(process.versions.node.split('.')[0]) < 20) { console.error('Please install Node.js 20 or newer.'); process.exit(1) }
const command = process.argv[2] || 'start'
function run(file, args) {
  const result = spawnSync(process.execPath, [file, ...args], { cwd: projectRoot, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
try {
  if (!['start', 'build', 'check', 'edit', 'dev'].includes(command)) throw new Error(`Unknown command: ${command}`)
  const { docs } = await stageContent(projectRoot, { demo: process.argv.includes('--demo') })
  const catalog = await checkContent(docs)
  console.log(`Content checked: ${catalog.pages.length} pages, ${catalog.chapters.length} chapters.`)
  if (command !== 'check') {
    const vitepress = resolve(projectRoot, 'node_modules/vitepress/bin/vitepress.js')
    if (command === 'dev' || command === 'edit') run(vitepress, ['dev', docs, '--host', '127.0.0.1', '--port', '4174', '--strictPort', ...(command === 'edit' ? ['--open'] : [])])
    else {
      run(vitepress, ['build', docs])
      if (command === 'start') run(resolve(projectRoot, 'scripts/serve.mjs'), ['--open'])
    }
  }
} catch (error) { console.error('Azeroth Library: ' + error.message); process.exitCode = 1 }
