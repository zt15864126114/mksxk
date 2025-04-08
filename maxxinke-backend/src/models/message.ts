import { db } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 基础消息类型
export interface Message {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  content: string;
  status: number;
  reply?: string;
  reply_time?: Date;
  create_time: Date;
  update_time: Date;
}

// 数据库消息类型
export interface DBMessage extends Message, RowDataPacket {}

// 获取留言列表
export const findAll = async (
  page: number = 1,
  pageSize: number = 10,
  status?: string,
  keyword?: string
) => {
  const offset = (page - 1) * pageSize;
  let query = 'SELECT * FROM messages WHERE 1=1';
  const params: any[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (keyword) {
    query += ' AND (name LIKE ? OR phone LIKE ? OR content LIKE ?)';
    const keywordParam = `%${keyword}%`;
    params.push(keywordParam, keywordParam, keywordParam);
  }

  query += ' ORDER BY create_time DESC LIMIT ? OFFSET ?';
  params.push(pageSize, offset);

  const [messages] = await db.query<DBMessage[]>(query, params);
  const [total] = await db.query<(RowDataPacket & { total: number })[]>('SELECT COUNT(*) as total FROM messages');

  return {
    list: messages,
    total: total[0].total,
    page,
    pageSize
  };
};

// 获取留言详情
export const findById = async (id: number): Promise<DBMessage | null> => {
  const [rows] = await db.query<DBMessage[]>('SELECT * FROM messages WHERE id = ?', [id]);
  return rows[0] || null;
};

// 创建留言
export const create = async (message: Omit<Message, 'id' | 'create_time' | 'update_time'>): Promise<number> => {
  const now = new Date();
  const [result] = await db.query<ResultSetHeader>(
    'INSERT INTO messages (name, phone, email, company, content, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [message.name, message.phone, message.email, message.company, message.content, message.status, now, now]
  );
  return result.insertId;
};

// 更新留言
export const update = async (id: number, message: Partial<Message>): Promise<void> => {
  const fields = [];
  const values = [];

  if (message.status !== undefined) {
    fields.push('status = ?');
    values.push(message.status);
  }

  if (message.reply !== undefined) {
    fields.push('reply = ?');
    values.push(message.reply);
  }

  if (message.reply_time) {
    fields.push('reply_time = ?');
    values.push(message.reply_time);
  }

  if (fields.length > 0) {
    fields.push('update_time = ?');
    values.push(new Date());
    values.push(id);

    await db.query(
      `UPDATE messages SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
};

// 删除留言
export const remove = async (id: number): Promise<void> => {
  await db.query('DELETE FROM messages WHERE id = ?', [id]);
}; 