import config from './config.js'

export function adminOnly(req, res, next) {
  if (!req.user) {
    return res.sendStatus(403)
  }

  const userRoles = req.user[`${config.auth0.customClaimNamespace}/roles`]

  if (!userRoles || !userRoles.map(u => u.toLowerCase()).includes('admin')) {
    return res.sendStatus(403)
  }

  next()
}
