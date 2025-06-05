// From npm:is-mobile (MIT License) by Julian Gruber
// https://github.com/juliangruber/is-mobile/blob/main/index.js

// Simplified plenty, not a proper UA parser, but good enough for us
// It might be better to use `ua-parser-js` or something to be more robust, but we're not doing anything
// critical and keeping the code dependency-free is nice.

const mobileRE =
  /(bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|iphone|ipod|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|redmi|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i
const notMobileRE = /CrOS/

export function isMobile(userAgent = window?.navigator?.userAgent) {
  if (!userAgent) return null
  return mobileRE.test(userAgent) && !notMobileRE.test(userAgent)
}
