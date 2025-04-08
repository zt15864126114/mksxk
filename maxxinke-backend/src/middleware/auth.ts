import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未授权，请先登录'
      });
    }

    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '无效的token'
    });
  }
}; 