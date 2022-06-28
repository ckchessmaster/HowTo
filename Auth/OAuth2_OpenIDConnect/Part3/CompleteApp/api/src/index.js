//import dotenv from 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes.js'

const app = express()
const port = 3000

app.use(cors())
app.use('/', routes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
