import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const project = fileURLToPath(new URL('../', import.meta.url))
process.chdir(project)
if (Number(process.versions.node.split('.')[0]) < 20) { console.error('Please install Node.js 20 or newer.'); process.exit(1) }
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const options = { cwd: project, stdio: 'inherit', shell: process.platform === 'win32' }
if (!existsSync('node_modules/vitepress/package.json')) {
  console.log('Installing the pinned editing tools. Internet is needed for this first setup.')
  const install = spawnSync(npm, ['ci', '--no-audit', '--no-fund'], options)
  if (install.status !== 0) process.exit(install.status || 1)
}
const result = spawnSync(npm, ['run', process.argv.includes('--new') ? 'new:page' : process.argv.includes('--build') ? 'build' : 'edit'], options)
process.exit(result.status || (result.error ? 1 : 0))
