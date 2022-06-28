import express from 'express'
import authMiddleware from './authenticationMiddleware.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.sendStatus(404)
})

router.get('/health', (req, res) => {
  res.send('Healthy')
})

router.get('/secure-route', authMiddleware, (req, res) => {
  res.send('Super secret stuff')
})

export default router
