import { Frame } from './frame.ts'

const frame = new Frame()
await frame.load('https://forms.gle/ZEBK8v684ARcuh1o9')
await frame.click({ x: 215, y: 320 })
await frame.click({ x: 226, y: 397 })
console.log('Success')
