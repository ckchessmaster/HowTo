import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import config from './config'

const app = createApp(App)

app.use(router)
app.use(
  createAuth0({
    domain: config.domain,
    client_id: config.clientId,
    redirect_uri: window.location.origin
  })
)

app.mount('#app')
