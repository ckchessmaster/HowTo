import config from './config.js'
import axios from 'axios'
import getPem from 'rsa-pem-from-mod-exp'
import crypto from 'crypto'

let openidConfig

export default async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.includes('Bearer ') ? authHeader.split('Bearer ')[1] : null

  if (!token) {
    console.warn('User did not provide a token.')
    return res.status(401).send('Unauthorized')
  }

  const tokenParts = token.split('.')

  if (tokenParts.length !== 3) {
    console.warn('Invalid token.')
    return res.status(401).send('Unauthorized')
  }

  try {
    const tokenHeader = JSON.parse(Buffer.from(tokenParts[0], 'base64url'))
    const tokenBody = JSON.parse(Buffer.from(tokenParts[1], 'base64url'))
    const tokenSignature = Buffer.from(tokenParts[2], 'base64url')

    if (!openidConfig) {
      const configResponse = await axios.get(`https://${config.domain}/.well-known/openid-configuration`)
      openidConfig = configResponse.data
    }

    const keyInfoResponse = await axios.get(openidConfig.jwks_uri)
    const keyInfo = keyInfoResponse.data

    const keys = keyInfo.keys.filter(k => k.kid === tokenHeader.kid)
    if (keys.length === 0) {
      console.warn('Key not found.')
      return res.status(401).send('Unauthorized')
    }

    const signingKey = keys[0]
    const publicKey = getPem(signingKey.n, signingKey.e)
    
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update(`${tokenParts[0]}.${tokenParts[1]}`)
    let isValid = verifier.verify(publicKey, tokenSignature)

    if (!isValid) {
      console.warn('Signature validation failed.')
      return res.status(401).send('Unauthorized')
    }

    const currentTime = Date.now() / 1000
    if (currentTime > tokenBody.exp) {
      console.warn('Token is expired.')
      return res.status(401).send('Unauthorized')
    }

    if (!tokenBody.aud.includes(config.audience)) {
      console.warn('Invalid audience.')
      return res.status(401).send('Unauthorized')
    }

    if (config.issuer !== tokenBody.iss) {
      console.warn('Invalid issuer.')
      return res.status(401).send('Unauthorized')
    }
    
    req.user = tokenBody
  } catch {
    console.warn('Invalid token.')
    return res.status(401).send('Unauthorized')
  }

  return next()
}
