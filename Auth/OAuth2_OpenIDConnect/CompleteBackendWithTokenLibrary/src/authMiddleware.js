import { JwksClient } from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import config from './config.js'

let _oidcConfig

export default async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401)
  }

  const oidcConfig = await getOidcConfig()

  let signingKey
  try {
    signingKey = await getSigningKey(token, oidcConfig)
  } catch (e) {
    console.warn(e)
    return res.sendStatus(401)
  }
  
  const verificationOptions = {
    audience: config.auth0.audience,
    issuer: `https://${config.auth0.domain}/`
  }

  try {
    req.user = jwt.verify(token, signingKey, verificationOptions)
  } catch (e) {
    console.warn(e)
    return res.sendStatus(401)
  }

  next()
}

async function getOidcConfig() {
  if (!_oidcConfig) {
    _oidcConfig = await axios.get(`https://${config.auth0.domain}/.well-known/openid-configuration`)
  }

  return _oidcConfig
}

async function getSigningKey(token, oidcConfig) {
  const decodedToken = jwt.decode(token, {complete: true})

  const jwksClient = new JwksClient({jwksUri: oidcConfig.data.jwks_uri })
  const key = await jwksClient.getSigningKey(decodedToken.header.kid)
  const signingKey = key.publicKey || key.rsaPublicKey

  return signingKey
}