import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // 处理已知错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: err.message
    });
  }

  // 处理未知错误
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  });
}; 