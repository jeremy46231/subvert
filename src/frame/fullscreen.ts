import { FrameAttack } from './abstractAttack.ts'
import {
  type Coordinate,
  sleep,
} from '../utils.ts'
import {
  calculateTransform,
  hiddenTransform,
  pageFocus
} from "./frameUtils.ts"

export class FullscreenClick extends FrameAttack {
  constructor(
    element: HTMLIFrameElement,
    protected target: Coordinate,
    protected buffer: number,
    protected delay: number,
    protected onClick = () => {}
  ) {
    super(element)

    window.addEventListener('resize', this.resizeHandler)
    this.updatePosition()
    // There doesn't seem to be an event that fires when the iframe is clicked,
    // but document.activeElement will be the iframe if it was clicked, so we
    // poll that
    this.interval = setInterval(() => this.checkActiveElement(), 10)
  }

  protected readonly resizeHandler = () => {
    this.updatePosition()
  }

  protected readonly interval: ReturnType<typeof setInterval>
  protected updatePosition() {
    const transform = calculateTransform(
      {
        top: this.target.y - this.buffer,
        left: this.target.x - this.buffer,
        width: 2 * this.buffer,
        height: 2 * this.buffer,
      },
      {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    )
    this.element.style.transform = transform
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
    window.removeEventListener('resize', this.resizeHandler)
    clearInterval(this.interval)
    this.element.style.transform = hiddenTransform
    this.reject(new Error('FullscreenClick disposed'))
  }
}
