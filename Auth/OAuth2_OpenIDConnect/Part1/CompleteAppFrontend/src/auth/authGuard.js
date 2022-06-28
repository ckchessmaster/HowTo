import { getInstance } from './index'
import { watch } from 'vue'

export const authenticationGuard = (to, from, next) => {
  const auth = getInstance()

  // This is the actual action we will call once the auth module is loaded
  const guardAction = () => {
    if (auth.isAuthenticated) {
      return next()
    }

    auth.login({ appState: { targetUrl: to.fullPath } })
  }

  // Wait for the auth module to load before we do anything else
  if (auth.loading) {
    watch(() => auth.loading, (currentValue, oldValue) => {
      if (currentValue === false) {
        guardAction()
      }
    })
  } else {
    guardAction()
  }
}