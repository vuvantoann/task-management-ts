import { Request, Response } from 'express'
import Task from '../models/task.model'
import paginationHelper from '../../../helper/pagination'
import searchHelper from '../../../helper/search'

export const index = async (req: Request, res: Response) => {
  // lọc theo trạng thái
  interface Find {
    deleted: boolean
    status?: string
    title?: RegExp
  }

  const find: Find = {
    deleted: false,
  }

  if (req.query.status) {
    find.status = req.query.status.toString()
  }
  // kết thúc

  // sắp xếp theo tiêu chí
  let sort = {}
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey.toString()
    sort[sortKey] = req.query.sortValue
  }
  // kết thúc

  // Phân trang

  const countTasks = await Task.countDocuments(find)
  let objectPagination = paginationHelper(
    {
      limitItem: 2,
      currentPage: 1,
    },
    req.query,
    countTasks
  )

  // kết thúc

  // Tìm kiếm

  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }
  // kết thúc

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)

  res.json(tasks)
}

//[PATCH]/api/v1/tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id = req.params.id
  const task = await Task.findOne({
    _id: id,
    deleted: false,
  })
  res.json(task)
}
