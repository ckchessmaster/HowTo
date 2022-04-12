import axios from 'axios'

export default class AuthenticationModule {
  loading = true
  isAuthenticated = false

  constructor(domain, clientId) {   
    this.domain = domain
    this.clientId = clientId
  }

  async init() {
    // Get the openid configuration details
    const configResponse = await axios.get(`https://${this.domain}/.well-known/openid-configuration`)
    this.openidConfig = configResponse.data

    this.loading = false
  }

  async login() {
    // location.href = `${this.openidConfig.authorization_endpoint}
    //   ?client_id=${this.clientId}
    //   &redirect_uri=${window.location.origin}
    //   &response_type=code
    //   &scope=openid`
    //this.loading = true
  }

  async logout() {

  }
}