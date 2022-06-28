import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.sendStatus(404)
})

router.get('/health', (req, res) => {
  res.send('Healthy')
})

router.get('/secure-route', (req, res) => {
  res.send('Super secret stuff')
})

export default router
