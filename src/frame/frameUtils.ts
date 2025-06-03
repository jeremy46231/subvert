import { Coordinate } from '../utils'

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
/**
 * Transforms a point from the source rectangle to the target rectangle.
 * Follows the same math as `calculateTransform`.
 * @param source - The source rectangle with properties: top, left, width, height.
 * @param target - The target rectangle with properties: top, left, width, height.
 * @param point - The point to transform, with properties: x, y.
 * @returns A new point with the transformed coordinates.
 */

export function transformPoint(
  source: { top: number; left: number; width: number; height: number },
  target: { top: number; left: number; width: number; height: number },
  point: Coordinate
): Coordinate {
  // First, transform the point into a unit square
  const unitX = (point.x - source.left) / source.width
  const unitY = (point.y - source.top) / source.height
  // Then, scale it to the target rectangle
  const targetX = target.left + unitX * target.width
  const targetY = target.top + unitY * target.height
  return { x: targetX, y: targetY }
}
/**
 * Calculate the CSS transform and clip-path required to take the source rectangle
 * and stretch and clip it to all of the target rectangles. This makes it so a click
 * in any of the target rectangles will end up somewhere in the source rectangle.
 * Assumes that the element has `transform-origin: 0 0`
 * @param source - The source rectangle with properties: top, left, width, height.
 * @param targets - An array of target rectangles, each with properties: top, left, width, height.
 * @returns An object containing the CSS transform and clip-path to apply to an element.
 */

export function calculateTransformAndClip(
  source: { top: number; left: number; width: number; height: number },
  targets: { top: number; left: number; width: number; height: number }[]
): {
  transform: string
  clipPath: string
} {
  // clip-path applies to the element before the transform, so we need to figure out the path
  // that will be transformed to the correct target rectangles when the transform is applied
  // then, we transform the source rectangle to the  bounding box of all the target rectangles
  if (targets.length === 0) {
    return { transform: hiddenTransform, clipPath: 'none' }
  }

  const targetsBoundingBox = targets.reduce((acc, target) => {
    return {
      top: Math.min(acc.top, target.top),
      left: Math.min(acc.left, target.left),
      width:
        Math.max(acc.left + acc.width, target.left + target.width) -
        Math.min(acc.left, target.left),
      height:
        Math.max(acc.top + acc.height, target.top + target.height) -
        Math.min(acc.top, target.top),
    }
  })

  const transform = calculateTransform(source, targetsBoundingBox)

  // clip-path is a svg path of all target rectangles, transformed back to the source rectangle
  const paths = targets.map((target) => {
    // Transform this target rectangle back to the source rectangle
    const transformedTopLeft = transformPoint(targetsBoundingBox, source, {
      x: target.left,
      y: target.top,
    })
    const transformedBottomRight = transformPoint(targetsBoundingBox, source, {
      x: target.left + target.width,
      y: target.top + target.height,
    })
    const transformedTarget = {
      x: transformedTopLeft.x,
      y: transformedTopLeft.y,
      width: transformedBottomRight.x - transformedTopLeft.x,
      height: transformedBottomRight.y - transformedTopLeft.y,
    }
    return (
      // Move to the top-left corner
      `M${transformedTarget.x},${transformedTarget.y}` +
      // Horizontal line to the right
      `h${transformedTarget.width}` +
      // Vertical line down
      `v${transformedTarget.height}` +
      // Horizontal line to the left
      `h-${transformedTarget.width}` +
      // Close the path
      `Z`
    )
  })

  const clipPath = `path(${JSON.stringify(paths.join(' '))})`

  return { transform, clipPath }
}

export function pageFocus() {
  const tempElement = document.createElement('input')
  document.body.appendChild(tempElement)
  tempElement.focus()
  document.body.removeChild(tempElement)
}

export function fakeHover(element: HTMLElement, hover: boolean): boolean {
  const eventTypes = hover
    ? ['pointerover', 'pointerenter', 'mouseover']
    : ['pointerout', 'pointerleave', 'mouseout']
  for (const eventType of eventTypes) {
    element.dispatchEvent(
      new PointerEvent(eventType, {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerType: 'mouse',
      })
    )
  }

  if (
    element.tagName === 'BUTTON' ||
    (element.tagName === 'INPUT' &&
      ['button', 'submit', 'reset'].includes(
        (element as HTMLInputElement).type
      ))
  ) {
    // If the element is a button, see if we can fake hover styling for the OS
    if (
      navigator.platform.startsWith('Mac') ||
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform)
    ) {
      // On Apple devices, apply background color to simulate hover
      if (hover) {
        Object.assign(element.style, {
          backgroundColor: '#d0d0d7',
          border: '1px solid #676774',
          padding: '2px 5px',
          borderRadius: '4px',
        })
      } else {
        element.style = '' // Reset style
      }
      return true
    }
  }
  return false
}
