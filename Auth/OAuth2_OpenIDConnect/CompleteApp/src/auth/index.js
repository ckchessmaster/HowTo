import Vue from 'vue';

let instance

export const getInstance = () => instance;

export const useAuth = () => {
  if (!instance) {
    instance = new Vue({
      
    })
  }

  return instance
}

export default {
  install(Vue) {
    Vue.prototype.$auth = useAuth()
  }
}