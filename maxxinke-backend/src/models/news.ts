import { db } from '../config/database';
import { News } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 获取新闻列表
export const findAll = async (
  page: number = 1,
  pageSize: number = 10,
  type?: string,
  keyword?: string
) => {
  const offset = (page - 1) * pageSize;
  let query = 'SELECT * FROM news WHERE status = 1';
  const params: any[] = [];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  if (keyword) {
    query += ' AND (title LIKE ? OR content LIKE ?)';
    const keywordParam = `%${keyword}%`;
    params.push(keywordParam, keywordParam);
  }

  query += ' ORDER BY create_time DESC LIMIT ? OFFSET ?';
  params.push(pageSize, offset);

  const [news] = await db.query<RowDataPacket[]>(query, params);
  const [total] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as total FROM news WHERE status = 1');

  return {
    list: news,
    total: (total[0] as any).total,
    page,
    pageSize
  };
};

// 获取新闻详情
export const findById = async (id: number): Promise<News | null> => {
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM news WHERE id = ? AND status = 1', [id]);
  return rows[0] as News || null;
};

// 创建新闻
export const create = async (news: Omit<News, 'id' | 'create_time' | 'update_time'>): Promise<number> => {
  const now = new Date();
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO news (title, content, image, type, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [news.title, news.content, news.image, news.type, news.status, now, now]
  );
  return result.insertId;
};

// 更新新闻
export const update = async (id: number, news: Partial<Omit<News, 'id' | 'create_time' | 'update_time'>>): Promise<void> => {
  const fields = [];
  const values = [];

  if (news.title !== undefined) {
    fields.push('title = ?');
    values.push(news.title);
  }

  if (news.content !== undefined) {
    fields.push('content = ?');
    values.push(news.content);
  }

  if (news.image !== undefined) {
    fields.push('image = ?');
    values.push(news.image);
  }

  if (news.type !== undefined) {
    fields.push('type = ?');
    values.push(news.type);
  }

  if (news.status !== undefined) {
    fields.push('status = ?');
    values.push(news.status);
  }

  if (fields.length > 0) {
    fields.push('update_time = ?');
    values.push(new Date());
    values.push(id);

    await db.query(
      `UPDATE news SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};

// 删除新闻
export const remove = async (id: number): Promise<void> => {
  await db.query('UPDATE news SET status = 0 WHERE id = ?', [id]);
}; 