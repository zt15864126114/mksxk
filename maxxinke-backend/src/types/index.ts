export interface Admin {
  id: number;
  username: string;
  password: string;
  real_name?: string;
  status: number;
  create_time: Date;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string;
  specification?: string;
  application?: string;
  image?: string;
  sort: number;
  status: number;
  create_time: Date;
}

export interface News {
  id: number;
  title: string;
  content?: string;
  image?: string;
  type: 'news' | 'industry';
  status: number;
  create_time: Date;
}

export interface Message {
  id: number;
  name: string;
  phone: string;
  email?: string;
  content: string;
  status: number;
  create_time: Date;
}

export interface JwtPayload {
  id: number;
  username: string;
} 