import { isMobile } from '../../library/isMobile'

Object.defineProperty(window, 'isMobile', {
  get: () => isMobile,
  set: () => {
    throw new Error('isMobile is read-only')
  },
})

declare global {
  interface Window {
    isMobile: () => boolean | null
  }
}
