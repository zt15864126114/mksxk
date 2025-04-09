import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/database';
import { Product } from '../types';

export const findAll = async (
  page: number = 1,
  pageSize: number = 10,
  category?: string,
  keyword?: string,
  isAdmin: boolean = false
) => {
  const offset = (page - 1) * pageSize;
  let query = isAdmin ? 'SELECT * FROM product WHERE 1=1' : 'SELECT * FROM product WHERE status = 1';
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

  // 获取总数的查询
  let countQuery = isAdmin 
    ? 'SELECT COUNT(*) as total FROM product WHERE 1=1' 
    : 'SELECT COUNT(*) as total FROM product WHERE status = 1';
  const countParams = [];
  
  if (category) {
    countQuery += ' AND category = ?';
    countParams.push(category);
  }
  
  if (keyword) {
    countQuery += ' AND (name LIKE ? OR description LIKE ?)';
    const keywordParam = `%${keyword}%`;
    countParams.push(keywordParam, keywordParam);
  }
  
  const [total] = await db.query<RowDataPacket[]>(countQuery, countParams);

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

export const findById = async (id: number, isAdmin: boolean = false): Promise<Product | null> => {
  const query = isAdmin
    ? 'SELECT * FROM product WHERE id = ?'
    : 'SELECT * FROM product WHERE id = ? AND status = 1';
  const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
  return rows[0] as Product || null;
};

export const create = async (product: Omit<Product, 'id' | 'create_time' | 'update_time'>): Promise<number> => {
  const [result] = await db.execute<any>(
    'INSERT INTO product (name, category, description, specification, application, image, sort, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [product.name, product.category, product.description, product.specification, product.application, product.image, product.sort, product.status]
  );
  return result.insertId;
};

export const update = async (id: number, product: Partial<Omit<Product, 'id' | 'create_time' | 'update_time'>>): Promise<void> => {
  const fields = Object.keys(product)
    .map(key => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(product), id];

  await db.execute(
    `UPDATE product SET ${fields}, update_time = NOW() WHERE id = ?`,
    values
  );
};

export const remove = async (id: number): Promise<void> => {
  await db.execute(
    'DELETE FROM product WHERE id = ?',
    [id]
  );
}; 