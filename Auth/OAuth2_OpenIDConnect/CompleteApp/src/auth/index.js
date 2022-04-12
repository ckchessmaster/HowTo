import AuthenticationModule from './authenticationModule';
import config from './config'

let instance

export const getInstance = () => instance;

const useAuthPlugin = () => {
  if (!instance) {
    instance = new AuthenticationModule(config.domain, config.clientId)
  }

  return instance
}

export default {
  install: (app, options) => {
    app.config.globalProperties.$auth = useAuthPlugin()
  }
}