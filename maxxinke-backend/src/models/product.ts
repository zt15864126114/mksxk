import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database';
import { Product } from '../types';

export const findAll = async (
  page: number = 1,
  pageSize: number = 10,
  category?: string,
  keyword?: string
) => {
  const offset = (page - 1) * pageSize;
  let query = 'SELECT * FROM product WHERE status = 1';
  const params: any[] = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (keyword) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    const keywordParam = `%${keyword}%`;
    params.push(keywordParam, keywordParam);
  }

  // 先获取总数
  const [total] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM product WHERE status = 1');

  // 添加排序和分页
  query += ' ORDER BY sort DESC, id DESC LIMIT ?, ?';
  params.push(offset, pageSize);

  const [rows] = await db.query<RowDataPacket[]>(query, params);

  return {
    list: rows,
    total: (total[0] as any).total,
    page,
    pageSize
  };
};

export const findById = async (id: number): Promise<Product | null> => {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT * FROM product WHERE id = ? AND status = 1',
    [id]
  );
  return rows[0] as Product || null;
};

export const create = async (product: Omit<Product, 'id' | 'create_time' | 'update_time'>): Promise<number> => {
  const now = new Date();
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO product (name, category, description, specification, application, image, sort, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product.name, product.category, product.description, product.specification, product.application, product.image, product.sort, product.status, now, now]
  );
  return result.insertId;
};

export const update = async (id: number, product: Partial<Omit<Product, 'id' | 'create_time' | 'update_time'>>): Promise<void> => {
  const fields = [];
  const values = [];

  // 添加更新时间
  fields.push('update_time = ?');
  values.push(new Date());

  if (product.name !== undefined) {
    fields.push('name = ?');
    values.push(product.name);
  }

  if (product.category !== undefined) {
    fields.push('category = ?');
    values.push(product.category);
  }

  if (product.description !== undefined) {
    fields.push('description = ?');
    values.push(product.description);
  }

  if (product.specification !== undefined) {
    fields.push('specification = ?');
    values.push(product.specification);
  }

  if (product.application !== undefined) {
    fields.push('application = ?');
    values.push(product.application);
  }

  if (product.image !== undefined) {
    fields.push('image = ?');
    values.push(product.image);
  }

  if (product.sort !== undefined) {
    fields.push('sort = ?');
    values.push(product.sort);
  }

  if (product.status !== undefined) {
    fields.push('status = ?');
    values.push(product.status);
  }

  values.push(id);

  const query = `UPDATE product SET ${fields.join(', ')} WHERE id = ?`;
  console.log('Update query:', query);
  console.log('Update values:', values);

  await db.execute(query, values);
};

export const remove = async (id: number): Promise<void> => {
  await db.execute(
    'UPDATE product SET status = 0 WHERE id = ?',
    [id]
  );
}; 