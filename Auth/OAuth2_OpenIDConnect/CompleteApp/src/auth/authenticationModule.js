import axios from 'axios'
import { nanoid } from 'nanoid'
import cryptojs from 'crypto-js'
import jwt_decode from "jwt-decode"

const codeVerifierName = 'demoCodeVerifier'

export default class AuthenticationModule {
  loading = true
  isAuthenticated = false
  user = {}

  constructor(domain, clientId) {   
    this.domain = domain
    this.clientId = clientId
  }

  async init() {
    // Get the openid configuration details
    const configResponse = await axios.get(`https://${this.domain}/.well-known/openid-configuration`)
    this.openidConfig = configResponse.data

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('code')) {
      const code = urlParams.get('code')

      const tokenRequestOptions = {
        method: 'POST',
        url: this.openidConfig.token_endpoint,
        headers: { 'content-type': 'application/json'},
        data: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          code_verifier: sessionStorage.getItem(codeVerifierName),
          code,
          redirect_uri: window.location.origin
        }
      }
      const tokenResponse = await axios.request(tokenRequestOptions)
      const idToken = tokenResponse.data.id_token
      const accessToken = tokenResponse.data.access_token

      this.idToken = idToken
      this.accessToken = accessToken
      this.isAuthenticated = true

      this.user = this.getUserInfoFromIdToken(this.idToken)
    }

    this.loading = false
  }

  async login() {
    const codeVerifier = nanoid(64)
    sessionStorage.setItem(codeVerifierName, codeVerifier) // Save the code verifier for when we come back from the login

    const codeChallenge = cryptojs.enc.Base64url.stringify(cryptojs.SHA256(codeVerifier))

    const loginUrl = new URL(this.openidConfig.authorization_endpoint)
    loginUrl.searchParams.append('client_id', this.clientId)
    loginUrl.searchParams.append('redirect_uri', window.location.origin)
    loginUrl.searchParams.append('response_type', 'code')
    loginUrl.searchParams.append('scope', 'openid profile email')
    loginUrl.searchParams.append('code_challenge', codeChallenge)
    loginUrl.searchParams.append('code_challenge_method', 'S256')
    
    window.location.href = loginUrl.href
  }

  async logout() {
    this.isAuthenticated = false
    this.user = {}

    // As of 4/12/2022 the OIDC spec does not include a logout URL so this will vary by auth provider
    const logoutUrl = new URL(`https://${this.domain}/v2/logout`)
    logoutUrl.searchParams.append('client_id', this.clientId)
    logoutUrl.searchParams.append('return_to', window.location.origin)

    // Uncomment this line to log the user out of their identity provider as well (like Google etc.)
    // This is especially useful for SSO scenerios
    //logoutUrl.searchParams.append('federated', 'true') 

    window.location.href = logoutUrl.href
  }

  getUserInfoFromIdToken(idToken) {
    const decodedToken = jwt_decode(idToken)

    return {
      email: decodedToken.email,
      firstName: decodedToken.given_name,
      lastName: decodedToken.family_name
    }
  }
}