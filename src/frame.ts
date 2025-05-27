type Coordinate = { x: number, y: number }

export class Frame {
  #frame: HTMLIFrameElement
  #parent: HTMLDivElement

  constructor(width = 1000, height = 1000) {
    const parent = document.createElement('div')
    const frame = document.createElement('iframe')
    parent.appendChild(frame)

    parent.style.position = 'fixed'
    parent.style.zIndex = '999999'
    parent.style.overflow = 'hidden'
    parent.style.opacity = '0.01'

    frame.style.position = 'absolute'
    frame.style.border = 'none'
    frame.style.transformOrigin = '0 0'

    this.#parent = parent
    this.#frame = frame
    this.setSize(width, height)
    this.#updatePosition()
    
    document.body.appendChild(parent)
  }

  setSize(width: number, height: number) {
    this.#frame.style.width = `${width}px`
    this.#frame.style.height = `${height}px`
  }

  #target: Coordinate = { x: 0, y: 0 }
  #targetBuffer: number = 5
  #screen: Coordinate = { x: -1000, y: -1000 }
  #screenBuffer: number = 50

  #updatePosition() {
    this.#parent.style.width = `${this.#screenBuffer * 2}px`
    this.#parent.style.height = `${this.#screenBuffer * 2}px`
    this.#parent.style.top = `${this.#screen.y - this.#screenBuffer}px`
    this.#parent.style.left = `${this.#screen.x - this.#screenBuffer}px`

    // transforms are applied in reverse order
    // translate the target point to the origin, then scale it, then translate it to the screen position
    this.#frame.style.transform = `
      translate(${this.#screenBuffer}px, ${this.#screenBuffer}px)
      scale(${this.#screenBuffer / this.#targetBuffer})
      translate(${-this.#target.x}px, ${-this.#target.y}px)
    `
  }

  #offscreen() {
    this.#screen.x = -1000
    this.#screen.y = -1000
    this.#updatePosition()
  }

  // setTarget(target: Coordinate) {
  //   this.#target = target
  //   this.#updatePosition()
  // }

  async click(target: Coordinate): Promise<void> {
    this.#target = target

    const followMouse = (event: MouseEvent) => {
      this.#screen.x = event.clientX
      this.#screen.y = event.clientY
      this.#updatePosition()
    }
    window.addEventListener('mousemove', followMouse)
  }
    

  async load(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.#frame.addEventListener('load', () => resolve())
      this.#frame.src = url
    })
  }

  dispose() {
    if (this.#frame.parentNode) {
      this.#frame.parentNode.removeChild(this.#frame)
    }
    this.#frame.remove()
    this.#frame.src = ''    
  }
}
