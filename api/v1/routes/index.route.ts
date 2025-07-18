import { Express } from 'express'
import { taskRoutes } from './task.route'
import { userRoutes } from './user.route'
import * as authMiddleware from '../middlewares/auth.middleware'
const routesV1 = (app: Express) => {
  const version = '/api/v1'

  app.use(version + '/tasks', authMiddleware.requireAuth, taskRoutes)

  app.use(version + '/users', userRoutes)
}

export default routesV1
