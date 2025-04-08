import { Request, Response } from 'express';
import * as newsModel from '../models/news';

// 获取新闻列表
export const getNews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const type = req.query.type as string;
    const keyword = req.query.keyword as string;

    const result = await newsModel.findAll(page, pageSize, type, keyword);

    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 获取新闻详情
export const getNewsItem = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const news = await newsModel.findById(id);

    if (!news) {
      return res.status(404).json({
        code: 404,
        message: '新闻不存在'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: news
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 创建新闻
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content, image, type } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({
        code: 400,
        message: '标题、内容和类型为必填项'
      });
    }

    const id = await newsModel.create({
      title,
      content,
      image,
      type,
      status: 1
    });

    res.json({
      code: 200,
      message: '新闻创建成功',
      data: { id }
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 更新新闻
export const updateNews = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, image, type, status } = req.body;

    const news = await newsModel.findById(id);
    if (!news) {
      return res.status(404).json({
        code: 404,
        message: '新闻不存在'
      });
    }

    await newsModel.update(id, {
      title,
      content,
      image,
      type,
      status
    });

    res.json({
      code: 200,
      message: '新闻更新成功'
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 删除新闻
export const deleteNews = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const news = await newsModel.findById(id);
    if (!news) {
      return res.status(404).json({
        code: 404,
        message: '新闻不存在'
      });
    }

    await newsModel.remove(id);

    res.json({
      code: 200,
      message: '新闻删除成功'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}; 