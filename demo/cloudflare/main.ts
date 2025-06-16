const $ = document.getElementById.bind(document)
const title = $('title') as HTMLHeadingElement
const loadingSpinner = $('loading-spinner') as HTMLDivElement
const coreText = $('core-text') as HTMLDivElement
const challengeErrorText = $('challenge-error-text') as HTMLHeadingElement
const turnstileWidget = $('turnstile-widget') as HTMLDivElement
const turnstileVerifying = $('turnstile-verifying') as HTMLDivElement
const turnstileCheckbox = $('turnstile-checkbox') as HTMLDivElement
const turnstileCheckboxInput = $('turnstile-checkbox-input') as HTMLInputElement
const turnstileStuckText = $('turnstile-stuck') as HTMLDivElement
const followPositionElement = $('follow-position') as HTMLDivElement
const popupElement = $('popup') as HTMLDivElement
const popupButton = $('popup-button') as HTMLButtonElement

title.textContent = location.hostname
coreText.textContent = `${location.hostname} needs to review the security of your connection before proceeding.`
turnstileCheckboxInput.checked = false

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
function randRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
async function randSleep(min: number, max: number): Promise<void> {
  await sleep(randRange(min, max))
}

// Main

;(async () => {
  await randSleep(400, 1_000)
  history.replaceState(null, '', location.pathname)

  await randSleep(0, 1_200)
  loadingSpinner.style.display = 'none'
  coreText.classList.add('spacer-top')

  await randSleep(200, 1_000)
  turnstileWidget.style.display = 'grid'

  await randSleep(500, 1_700)
  turnstileVerifying.style.display = 'none'
  turnstileCheckbox.style.display = 'grid'
  challengeErrorText.textContent =
    'Verify you are human by completing the action below.'
})()

turnstileCheckboxInput.addEventListener(
  'change',
  async function checkboxChange() {
    if (!turnstileCheckboxInput.checked) return
    turnstileCheckbox.removeEventListener('change', checkboxChange)

    await randSleep(170, 250)
    turnstileVerifying.style.display = 'grid'
    turnstileCheckbox.style.display = 'none'
    challengeErrorText.textContent =
      'Verifying you are human. This may take a few seconds.'

    await randSleep(1_500, 3_000)
    // if (Math.random() < 0.5) {
    //   turnstileStuckText.style.display = 'inline-block'
    //   await randSleep(100, 250)
    //   turnstileStuckText.style.display = 'none'
    // }

    popupElement.style.removeProperty('display')
    updatePopupPosition()
    setInterval(updatePopupPosition, 10)
  }
)

function calculatePositions() {
  const widgetRect = turnstileWidget.getBoundingClientRect()
  const followPositionRect = followPositionElement.getBoundingClientRect()

  const buttonTop = followPositionRect.top
  const buttonBottom = followPositionRect.bottom
  let buttonLeft: number
  let buttonRight: number

  const minButtonWidth = Math.min(followPositionRect.width, 100)

  // calculate where the button and widget overlap
  const overlapLeft = Math.max(widgetRect.left, followPositionRect.left)
  const overlapRight = Math.min(widgetRect.right, followPositionRect.right)
  const overlapWidth = overlapRight - overlapLeft
  if (overlapWidth >= minButtonWidth) {
    // the overlap is big enough, use it!
    buttonLeft = overlapLeft
    buttonRight = overlapRight
  } else {
    // will need to expand
    // how much each side needs to expand
    const halfDeficit = (minButtonWidth - overlapWidth) / 2

    // naively expand to the left and right
    buttonLeft = overlapLeft - halfDeficit
    buttonRight = overlapRight + halfDeficit

    // clamp to the followPositionRect
    if (buttonRight > followPositionRect.right) {
      buttonRight = followPositionRect.right
      buttonLeft = buttonRight - minButtonWidth
    }
    if (buttonLeft < followPositionRect.left) {
      buttonLeft = followPositionRect.left
      buttonRight = buttonLeft + minButtonWidth
    }
  }

  const widgetTop = Math.min(widgetRect.top, followPositionRect.top)
  const widgetBottom = Math.max(widgetRect.bottom, followPositionRect.bottom)
  const widgetLeft = Math.min(widgetRect.left, buttonLeft)
  const widgetRight = Math.max(widgetRect.right, buttonRight)

  return {
    widget: {
      top: widgetTop,
      bottom: widgetBottom,
      left: widgetLeft,
      right: widgetRight,
    },
    button: {
      top: buttonTop,
      bottom: buttonBottom,
      left: buttonLeft,
      right: buttonRight,
    },
  }
}
function updatePopupPosition() {
  const positions = calculatePositions()

  const padding = 10

  popupElement.style.top = `${positions.widget.top - padding}px`
  popupElement.style.left = `${positions.widget.left - padding}px`
  popupElement.style.width = `${positions.widget.right - positions.widget.left + padding * 2}px`
  popupElement.style.height = `${positions.widget.bottom - positions.widget.top + padding * 2}px`

  popupButton.style.top = `${positions.button.top}px`
  popupButton.style.left = `${positions.button.left}px`
  popupButton.style.width = `${positions.button.right - positions.button.left}px`
  popupButton.style.height = `${positions.button.bottom - positions.button.top}px`
}

export {}
