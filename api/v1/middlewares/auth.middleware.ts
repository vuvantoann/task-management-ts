import { NextFunction, Request, Response } from 'express'
import User from '../models/user.model'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.headers.authorization) {
    const token: string = req.headers.authorization.split(' ')[1]
    const infoUser = await User.findOne({
      token: token,
      deleted: false,
    }).select('-password ')

    if (!infoUser) {
      res.json({
        code: 400,
        message: 'Tài khoản không hợp lệ',
      })
      return
    }

    req['user'] = infoUser
    next()
  } else {
    res.json({
      code: 400,
      message: 'bạn cần gửi kèm token',
    })
  }
}
