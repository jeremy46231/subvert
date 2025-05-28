export abstract class FrameAttack {
  protected readonly element!: HTMLIFrameElement

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
