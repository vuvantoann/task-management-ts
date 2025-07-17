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

//[PATCH]/api/v1/tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id
    const status: string = req.body.status

    console.log(id)
    console.log(status)

    await Task.updateOne({ _id: id }, { status: status })

    return res.json({
      code: 200,
      message: 'Cập nhật trạng thái thành công!',
    })
  } catch (error) {
    console.error('Lỗi changeStatus:', error)
    return res.status(400).json({
      code: 400,
      message: 'Không tồn tại!',
    })
  }
}

//[PATCH]/api/v1/tasks/change-status/:id
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids
    const key: string = req.body.key
    const value: string = req.body.value

    switch (key) {
      case 'status':
        await Task.updateMany({ _id: { $in: ids } }, { [key]: value })
        res.json({
          code: 200,
          message: 'Cập nhật trạng thái thành công',
        })
        break

      default:
        res.json({
          code: 400,
          message: 'Không tồn tại',
        })
    }
  } catch (error) {
    console.error('Lỗi changeStatus:', error)
    return res.status(400).json({
      code: 400,
      message: 'Không tồn tại!',
    })
  }
}

//[POST]/api/v1/tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    const newTask = new Task(req.body)
    const data = await newTask.save()

    return res.json({
      code: 200,
      message: 'tạo sản phẩm thành công!',
      data: data,
    })
  } catch (error) {
    console.error('Lỗi changeStatus:', error)
    return res.status(400).json({
      code: 400,
      message: 'Không tồn tại!',
    })
  }
}
