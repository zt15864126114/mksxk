import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { Admin } from '../types';

export const findByUsername = async (username: string): Promise<Admin | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM admins WHERE username = ?',
    [username]
  );
  return rows[0] as Admin || null;
};

export const create = async (admin: Partial<Admin>): Promise<number> => {
  const hashedPassword = await bcrypt.hash(admin.password!, 10);
  const [result] = await db.query(
    'INSERT INTO admins (username, password, real_name, status) VALUES (?, ?, ?, ?)',
    [admin.username, hashedPassword, admin.real_name || null, admin.status || 1]
  );
  return (result as any).insertId;
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const changePassword = async (id: number, newPassword: string): Promise<void> => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query(
    'UPDATE admins SET password = ? WHERE id = ?',
    [hashedPassword, id]
  );
}; 