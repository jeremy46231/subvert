import { FrameAttack } from './abstractAttack.ts'
import {
  type Coordinate,
  calculateTransformAndClip,
  hiddenTransform,
  pageFocus,
  sleep,
} from '../utils.ts'

const eventNames = ['resize', 'scroll', 'orientationchange']

export class ElementClick extends FrameAttack {
  constructor(
    element: HTMLIFrameElement,
    protected pageElements: HTMLElement[],
    protected target: Coordinate,
    protected buffer: number = 5,
    protected delay: number = 300,
    protected onClick = () => {},
    protected onHoverStart = () => {},
    protected onHoverEnd = () => {}
  ) {
    super(element)

    for (const eventName of eventNames)
      window.addEventListener(eventName, this.positionHandler)
    this.positionInterval = setInterval(this.positionHandler, 100)

    this.updatePosition()
    // There doesn't seem to be an event that fires when the iframe is clicked,
    // but document.activeElement will be the iframe if it was clicked, so we
    // poll that
    this.interval = setInterval(() => this.checkActiveElement(), 10)

    window.addEventListener('mouseover', this.pointerHandler)
    window.addEventListener('mouseout', this.pointerHandler)
    window.addEventListener('pointermove', this.pointerHandler, {
      passive: true,
    })
  }

  protected readonly positionInterval: ReturnType<typeof setInterval>
  protected hovering = false
  protected readonly positionHandler = () => {
    this.updatePosition()
  }
  protected readonly pointerHandler = (event: Event) => {
    const previousHovering = this.hovering
    if (event.type === 'mouseover') {
      if (event.target !== this.element) return
      this.hovering = true
    } else if (event.type === 'mouseout') {
      if (event.target !== this.element) return
      this.hovering = false
    } else if (event.type === 'pointermove') {
      // If we see the pointer moving, they must not be hovering the iframe anymore
      this.hovering = false
    } else {
      throw new Error(`Unexpected pointer event: ${event.type}`)
    }

    if (this.hovering !== previousHovering && this.pageElements.length === 1) {
      if (this.hovering) {
        this.onHoverStart()
      } else {
        this.onHoverEnd()
      }
    }
  }

  protected readonly interval: ReturnType<typeof setInterval>
  protected updatePosition() {
    const pageElementRects = this.pageElements.flatMap((el) => [
      ...el.getClientRects(),
    ])

    const { transform, clipPath } = calculateTransformAndClip(
      {
        top: this.target.y - this.buffer,
        left: this.target.x - this.buffer,
        width: 2 * this.buffer,
        height: 2 * this.buffer,
      },
      pageElementRects
    )
    this.element.style.transform = transform
    this.element.style.clipPath = clipPath
  }

  /** Used to stop the callback from triggering multiple times */
  protected clicked = false
  /** Checks to see if the iframe has gained focus */
  protected async checkActiveElement() {
    if (!this.clicked && document.activeElement === this.element) {
      // The iframe is focused, the user probably clicked it
      // Stop waiting for clicks
      this.clicked = true
      clearInterval(this.interval)

      this.onClick()

      // Wait for the click to probably end (no way to tell if it has)
      await sleep(this.delay)

      // Remove focus from the iframe and clean up
      pageFocus()
      this.resolve()
      this.dispose()
    }
  }

  // Does some stuff it doesn't usually need to do, but it's a no-op usually
  // and helpful when disposing early
  dispose() {
    for (const eventName of eventNames)
      window.removeEventListener(eventName, this.positionHandler)
    clearInterval(this.positionInterval)
    clearInterval(this.interval)
    window.removeEventListener('mouseover', this.pointerHandler)
    window.removeEventListener('mouseout', this.pointerHandler)
    window.removeEventListener('pointermove', this.pointerHandler)
    this.onHoverEnd()
    this.element.style.transform = hiddenTransform
    this.reject(new Error('ElementClick disposed'))
  }
}
