import AuthenticationModule from './authenticationModule';
import config from './config'
import { reactive } from 'vue'

let instance

export const getInstance = () => instance;

const useAuthPlugin = () => {
  if (!instance) {
    instance = reactive(new AuthenticationModule(config.domain, config.clientId))
  }

  instance.init()

  return instance
}

export default {
  install: (app, options) => {
    app.provide('auth', useAuthPlugin())
  }
}