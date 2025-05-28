export type Coordinate = { x: number; y: number }
export const hiddenTransform = 'translate(-300%, -300%)'

/**
 * Calculate the CSS transform required to map a source rectangle to a target rectangle.
 * Assumes that the element has `transform-origin: 0 0`
 * @param source - The source rectangle with properties: top, left, width, height.
 * @param target - The target rectangle with properties: top, left, width, height.
 * @returns A string representing the CSS transform to apply to an element.
 */
export function calculateTransform(
  source: { top: number; left: number; width: number; height: number },
  target: { top: number; left: number; width: number; height: number }
) {
  const transforms = [
    `translate(${-source.left}px, ${-source.top}px)`,
    `scale(${target.width / source.width}, ${target.height / source.height})`,
    `translate(${target.left}px, ${target.top}px)`,
  ]
  return transforms.reverse().join(' ')
}

export function pageFocus() {
  const tempElement = document.createElement('input')
  document.body.appendChild(tempElement)
  tempElement.focus()
  document.body.removeChild(tempElement)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
