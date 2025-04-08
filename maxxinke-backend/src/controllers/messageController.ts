import { Request, Response } from 'express';
import * as MessageModel from '../models/message';
import { Message } from '../models/message';

// 创建留言
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, company, content } = req.body;
    
    // 验证必填字段
    if (!name || !phone || !content) {
      return res.status(400).json({
        code: 400,
        message: '姓名、电话和留言内容为必填项'
      });
    }

    // 创建新留言
    const messageId = await MessageModel.create({
      name,
      phone,
      email,
      company,
      content,
      status: 0 // 0: 待处理
    });

    // 发送成功响应
    res.status(201).json({
      code: 200,
      message: '留言提交成功',
      data: { id: messageId }
    });
  } catch (error) {
    console.error('创建留言失败:', error);
    res.status(500).json({
      code: 500,
      message: '留言提交失败，请稍后重试'
    });
  }
};

// 获取留言列表（管理员接口）
export const getMessages = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    const keyword = req.query.keyword as string;

    const result = await MessageModel.findAll(page, pageSize, status, keyword);

    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('获取留言列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取留言列表失败'
    });
  }
};

// 更新留言状态（管理员接口）
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reply } = req.body;

    const message = await MessageModel.findById(parseInt(id));
    if (!message) {
      return res.status(404).json({
        code: 404,
        message: '留言不存在'
      });
    }

    const updateData: Partial<Message> = {};
    
    if (status !== undefined) {
      updateData.status = parseInt(status);
    }
    
    if (reply !== undefined) {
      updateData.reply = reply;
      updateData.reply_time = new Date();
    }

    await MessageModel.update(parseInt(id), updateData);

    res.json({
      code: 200,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新留言失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新留言失败'
    });
  }
};

// 删除留言（管理员接口）
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await MessageModel.findById(parseInt(id));
    if (!message) {
      return res.status(404).json({
        code: 404,
        message: '留言不存在'
      });
    }

    await MessageModel.remove(parseInt(id));

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除留言失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除留言失败'
    });
  }
}; 