import express, { Express } from 'express'
import dotenv from 'dotenv'
import * as database from './config/database'
import routesV1 from './api/v1/routes/index.route'
import cors from 'cors'
dotenv.config()
database.connect()
const app: Express = express()
const port: string | number = process.env.PORT || 3000
// Enable CORS
app.use(cors())

app.use(express.json()) // Thêm dòng này
//app.use(express.urlencoded({ extended: true }))

routesV1(app)

app.listen(port, () => {
  console.log('lắng nghe thành công ')
})
