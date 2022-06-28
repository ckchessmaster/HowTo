//import dotenv from 'dotenv/config'
import express from 'express'
import routes from './routes.js'

const app = express()
const port = 3000

app.use('/', routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
