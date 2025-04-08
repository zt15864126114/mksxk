import { Request, Response } from 'express';
import * as adminModel from '../models/admin';
import { generateToken } from '../utils/jwt';

// 管理员登录
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      });
    }

    const admin = await adminModel.findByUsername(username);
    if (!admin) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    const isPasswordValid = await adminModel.comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      });
    }

    if (admin.status !== 1) {
      return res.status(403).json({
        code: 403,
        message: '账号已被禁用'
      });
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username
    });

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: admin.id,
          username: admin.username,
          real_name: admin.real_name
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 修改密码
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { old_password, new_password } = req.body;
    const adminId = (req as any).user.id;

    if (!old_password || !new_password) {
      return res.status(400).json({
        code: 400,
        message: '旧密码和新密码不能为空'
      });
    }

    const admin = await adminModel.findByUsername((req as any).user.username);
    if (!admin) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    const isPasswordValid = await adminModel.comparePassword(old_password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '旧密码错误'
      });
    }

    await adminModel.changePassword(adminId, new_password);

    res.json({
      code: 200,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}; 