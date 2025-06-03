import { type Coordinate } from '../utils.ts'
import { hiddenTransform, fakeHover } from "./frameUtils.ts"
import { FrameAttack } from './abstractAttack.ts'
import { FullscreenClick } from './fullscreen.ts'
import { ElementClick } from './element.ts'

export class Frame {
  /** The iframe that will be used for the attack */
  protected readonly element: HTMLIFrameElement

  /** The current attack in progress, if any */
  protected currentAttack: FrameAttack | null = null

  /** Whether the class has been disposed */
  protected disposed: boolean = false
  /** If the frame was retrieved, it will not be removed when disposing */
  protected frameRetrieved: boolean = false

  constructor(
    width = 1000,
    height = 1000,
    public buffer = 5,
    public delay = 350
  ) {
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
  async load(url: string, timeoutMs = 15_000): Promise<void> {
    return new Promise((resolve, reject) => {
      this.element.addEventListener('load', () => resolve())
      this.element.src = url
      setTimeout(() => reject(new Error('Frame load timed out')), timeoutMs)
    })
  }

  /**
   * Clicks the speicified target by covering the entire viewport with the iframe
   * and waiting for the user to click anywhere.
   * @param target The coordinate to click
   * @param onClick Optional callback to run as soon as the click starts (before
   * the timeout that lets the click finish)
   */
  async fullscreenClick(
    target: Coordinate,
    onClick?: () => void
  ): Promise<void> {
    if (this.disposed) throw new Error('Frame has been disposed')
    if (this.currentAttack)
      throw new Error('Another attack is already in progress')

    this.currentAttack = new FullscreenClick(
      this.element,
      target,
      this.buffer,
      this.delay,
      onClick
    )
    try {
      await this.currentAttack.promise
    } finally {
      this.currentAttack = null
    }
  }

  /**
   * Clicks the speicified target by covering the given element with the iframe
   * and waiting for the user to click that element.
   * @param pageElement The element to cover with the iframe
   * @param target The coordinate to click
   * @param onClick Optional callback to run as soon as the click starts (before
   * the timeout that lets the click finish) - defaults to `pageElement.click()`
   * @param onHoverStart Optional callback to run when the iframe is hovered -
   * defaults to faking hover styles on the element (if the element is supported)
   * @param onHoverEnd Optional callback to run when the iframe is no longer
   * hovered - defaults to clearing the inline styles on the element
   */
  async elementClick(
    pageElement: HTMLElement,
    target: Coordinate,
    onClick?: () => void,
    onHoverStart?: () => void,
    onHoverEnd?: () => void
  ): Promise<void>
  /**
   * Clicks the speicified target by covering the given elements with the iframe
   * and waiting for the user to click any of those elements.
   * @param pageElements The elements to cover with the iframe
   * @param target The coordinate to click
   * @param onClick Optional callback to run as soon as the click starts (before
   * the timeout that lets the click finish)
   */
  async elementClick(
    pageElements: HTMLElement[],
    target: Coordinate,
    onClick?: () => void
  ): Promise<void>
  async elementClick(
    pageElements: HTMLElement | HTMLElement[],
    target: Coordinate,
    onClick = () => {
      if (Array.isArray(pageElements)) return
      pageElements.click()
    },
    onHoverStart = () => {
      if (Array.isArray(pageElements)) return
      fakeHover(pageElements, true)
    },
    onHoverEnd = () => {
      if (Array.isArray(pageElements)) return
      fakeHover(pageElements, false)
    }
  ): Promise<void> {
    if (this.disposed) throw new Error('Frame has been disposed')
    if (this.currentAttack)
      throw new Error('Another attack is already in progress')

    const elementList = Array.isArray(pageElements)
      ? pageElements
      : [pageElements]

    this.currentAttack = new ElementClick(
      this.element,
      elementList,
      target,
      this.buffer,
      this.delay,
      onClick,
      onHoverStart,
      onHoverEnd
    )
    try {
      await this.currentAttack.promise
    } finally {
      this.currentAttack = null
    }
  }

  /**
   * get the frame element and clean up
   * this is like dispose, but it doesn't get rid of the frame
   * @returns the iframe element
   */
  retriveFrame(): HTMLIFrameElement {
    if (this.disposed) throw new Error('Frame has been disposed')
    this.frameRetrieved = true
    this.dispose()
    return this.element
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

    // Only remove the frame if it hasn't been retrieved
    if (!this.frameRetrieved) {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
      this.element.remove()
      this.element.src = ''
    }
  }
  [Symbol.dispose]() {
    this.dispose()
  }
}
