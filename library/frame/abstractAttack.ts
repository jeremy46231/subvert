export abstract class FrameAttack {
  constructor(protected readonly element: HTMLIFrameElement) {
    if (document.activeElement === this.element) {
      throw new Error(
        'ElementClick cannot be started while the iframe is already focused'
      )
    }
  }

  protected resolve!: () => void
  protected reject!: (reason?: any) => void
  readonly promise = new Promise<void>((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })

  dispose() {
    this.reject(new Error(`${this.constructor.name} disposed`))
  }
  [Symbol.dispose]() {
    this.dispose()
  }
}
