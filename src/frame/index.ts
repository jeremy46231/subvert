import { hiddenTransform, type Coordinate } from '../utils.ts'
import { FrameAttack } from './abstractAttack.ts'
import { FullscreenClick } from './fullscreen.ts'

export class Frame {
  protected readonly element: HTMLIFrameElement

  protected currentAttack: FrameAttack | null = null

  protected disposed: boolean = false

  constructor(width = 1000, height = 1000) {
    this.element = document.createElement('iframe')

    this.element.style.position = 'fixed'
    this.element.style.top = '0'
    this.element.style.left = '0'
    this.element.style.zIndex = '999999'

    this.element.style.border = 'none'
    this.element.style.opacity = '0.01'
    this.element.style.transformOrigin = '0 0'

    this.element.style.transform = hiddenTransform

    this.setSize(width, height)

    document.body.appendChild(this.element)
  }

  setSize(width: number, height: number) {
    this.element.style.width = `${width}px`
    this.element.style.height = `${height}px`
  }

  /**
   * load the given url into the frame
   * resolves when the frame has loaded
  */
 async load(url: string): Promise<void> {
   return new Promise((resolve, reject) => {
     this.element.addEventListener('load', () => resolve())
     this.element.src = url
    })
  }
  
  async fullscreenClick(target: Coordinate, buffer?: number): Promise<void> {
    if (this.disposed) throw new Error('Frame has been disposed')
    if (this.currentAttack)
      throw new Error('Another attack is already in progress')

    this.currentAttack = new FullscreenClick(this.element, target, buffer)
    await this.currentAttack.promise
    this.currentAttack = null
    return
  }

  /**
   * remove the frame from the DOM and clean up
   */
  dispose() {
    this.disposed = true
    if (this.currentAttack) {
      this.currentAttack.dispose()
      this.currentAttack = null
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
    this.element.remove()
    this.element.src = ''
  }
  [Symbol.dispose]() {
    this.dispose()
  }
}
