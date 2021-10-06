import { Builder, builder } from '@builder.io/sdk'
import { getTargetingCookies } from './cookie-utils'

export const initUserAttributes = (cookiesMap: Record<string, string>) => {
  if (Builder.isBrowser) {
    const targeting = getTargetingCookies(cookiesMap).reduce((acc, cookie) => {
      const value = cookiesMap[cookie]
      const key = cookie.split('builder.userAttributes.')[1]
      return {
        ...acc,
        [key]: value,
      }
    }, {})
    builder.setUserAttributes(targeting)
  }
}
