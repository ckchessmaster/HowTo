export default (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.includes('Bearer ') ? authHeader.split('Bearer ')[1] : null

  if (!token) {
    console.warn('User did not provide a token.')
    return res.status(401).send('Not Authorized.')
  }

  const tokenParts = token.split('.')

  if (tokenParts.length !== 3) {
    console.warn('Invalid token.')
    return res.status(401).send('Not Authorized.')
  }

  try {
    const tokenHeader = JSON.parse(Buffer.from(tokenParts[0], 'base64url'))
    const tokenBody = JSON.parse(Buffer.from(tokenParts[1], 'base64url'))
    const tokenSignature = Buffer.from(tokenParts[2], 'base64url').toString()

  } catch {
    console.warn('Invalid token.')
    return res.status(401).send('Not Authorized.')
  }

  return next()
}
