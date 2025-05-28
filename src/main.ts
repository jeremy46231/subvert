import { Frame } from './frame/index.ts'
import { sleep } from './utils.ts'

async function main() {
  const frame = new Frame()

  await frame.load('https://forms.gle/ZEBK8v684ARcuh1o9')

  await frame.fullscreenClick({ x: 215, y: 320 }) // Click the option
  await frame.fullscreenClick({ x: 226, y: 397 }) // Click Submit

  await sleep(1000) // Wait for the form to submit

  console.log('Success')
}

document.getElementById('subvert')?.addEventListener('click', main)
