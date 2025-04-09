import { Request, Response } from 'express';
import * as productModel from '../models/product';

// 获取产品列表
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;
    const isAdmin = req.query.isAdmin === 'true';

    const result = await productModel.findAll(page, pageSize, category, keyword, isAdmin);

    res.json({
      code: 200,
      message: 'success',
      data: result
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 获取产品详情
export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const isAdmin = req.query.isAdmin === 'true';
    const product = await productModel.findById(id, isAdmin);

    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    res.json({
      code: 200,
      message: 'success',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 创建产品
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, description, specification, application, image, sort } = req.body;

    // 验证必填字段
    if (!name || !category) {
      return res.status(400).json({
        code: 400,
        message: '产品名称和分类为必填项'
      });
    }

    const id = await productModel.create({
      name,
      category,
      description,
      specification,
      application,
      image,
      sort: sort || 0,
      status: 1
    });

    res.json({
      code: 200,
      message: '产品创建成功',
      data: { id }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 更新产品
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, description, specification, application, image, sort, status } = req.body;

    console.log('Update product request body:', req.body);

    const product = await productModel.findById(id, true);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 确保所有字段都有值
    const updateData = {
      name: name || product.name,
      category: category || product.category,
      description: description || product.description,
      specification: specification || product.specification,
      application: application || product.application,
      image: image || product.image,
      sort: sort !== undefined ? sort : product.sort,
      status: status !== undefined ? parseInt(status) : product.status
    };

    console.log('Update data:', updateData);

    await productModel.update(id, updateData);

    // 验证更新是否成功
    const updatedProduct = await productModel.findById(id, true);
    console.log('Updated product:', updatedProduct);

    res.json({
      code: 200,
      message: '产品更新成功',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
};

// 删除产品
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // 检查产品是否存在
    const product = await productModel.findById(id, true);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: '产品不存在'
      });
    }

    // 执行真实删除
    await productModel.remove(id);

    res.json({
      code: 200,
      message: '产品删除成功'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}; 