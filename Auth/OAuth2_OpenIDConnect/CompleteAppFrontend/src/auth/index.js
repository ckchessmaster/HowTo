import AuthenticationModule from './authenticationModule';
import config from './config'
import { reactive } from 'vue'

let instance

export const getInstance = () => instance;

const useAuthPlugin = () => {
  if (!instance) {
    // We use the reactive() method here so that Vue can watch the properties of our auth module
    instance = reactive(new AuthenticationModule(config.domain, config.clientId))
  }

  instance.init() // Firing off an async method to start getting stuff ready

  return instance
}

export default {
  install: (app, options) => {
    app.provide('auth', useAuthPlugin())
  }
}