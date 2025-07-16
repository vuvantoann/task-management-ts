import { Express } from 'express'
import { taskRoutes } from './task.route'

const routesV1 = (app: Express) => {
  const version = '/api/v1'

  app.use(version + '/tasks', taskRoutes)
}

export default routesV1
