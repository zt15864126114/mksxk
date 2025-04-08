import { RowDataPacket } from 'mysql2';

export interface JwtPayload {
  id: number;
  username: string;
}

export interface Admin extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  real_name?: string;
  status: number;
  create_time: Date;
  update_time: Date;
}

export interface Product extends RowDataPacket {
  id: number;
  name: string;
  category: string;
  description?: string;
  specification?: string;
  application?: string;
  image?: string;
  sort?: number;
  status: number;
  create_time: Date;
  update_time: Date;
}

export interface News extends RowDataPacket {
  id: number;
  title: string;
  content?: string;
  image?: string;
  type: string;
  status: number;
  create_time: Date;
  update_time: Date;
}

export interface Message extends RowDataPacket {
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