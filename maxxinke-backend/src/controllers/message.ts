import { Request, Response } from 'express';
import * as messageModel from '../models/message';

// 获取留言列表
export const getMessages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    const keyword = req.query.keyword as string;

    const result = await messageModel.findAll(page, pageSize, status, keyword);

    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 获取留言详情
export const getMessage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const message = await messageModel.findById(id);

    if (!message) {
      return res.status(404).json({
        code: 404,
        message: '留言不存在'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: message
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 创建留言
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, company, content } = req.body;

    if (!name || !phone || !content) {
      return res.status(400).json({
        code: 400,
        message: '姓名、电话和留言内容不能为空'
      });
    }

    const id = await messageModel.create({
      name,
      phone,
      email,
      company,
      content,
      status: 0 // 0: 未处理, 1: 已处理
    });

    res.json({
      code: 200,
      message: '留言提交成功',
      data: { id }
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 更新留言状态
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status, reply } = req.body;

    const message = await messageModel.findById(id);
    if (!message) {
      return res.status(404).json({
        code: 404,
        message: '留言不存在'
      });
    }

    await messageModel.update(id, {
      status,
      reply,
      reply_time: new Date()
    });

    res.json({
      code: 200,
      message: '更新成功'
    });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 删除留言
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    const message = await messageModel.findById(id);
    if (!message) {
      return res.status(404).json({
        code: 404,
        message: '留言不存在'
      });
    }

    await messageModel.remove(id);

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}; 