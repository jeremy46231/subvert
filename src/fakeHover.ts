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
    (element.tagName === 'INPUT' && element.getAttribute('type') === 'button')
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
