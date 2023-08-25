import { CloudinaryResultHandler, NotificationStatus, OrderStatus, ResultEvent } from './types';

export interface Category {
  name: string;
  image: string;
}

export interface Cart {
  totalItems: number;
  totalPrice: number;
  [key: string]: number;
}

export interface Notification {
  time: string;
  message: string;
  status: NotificationStatus;
}

export interface User {
  __v: number;
  _id: string;
  cart: Cart;
  name: string;
  email: string;
  orders: any[];
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  notifications: Notification[];
}

export interface AlertProps {
  msg: string;
  zIndex?: string;
  bgColor?: string;
  duration?: number;
  textColor?: string;
}

export interface ResultInfo {
  url: string;
  public_id: string;
}

export interface Result {
  info: ResultInfo;
  event: ResultEvent;
}

export interface CloudinaryParameters {
  cloudName: string;
  uploadPreset: string;
}

export interface Product {
  __v: number;
  _id: string;
  name: string;
  price: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  totalItems?: number;
  images: ResultInfo[];
}

export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Order {
  __v: number;
  _id: string;
  date: string;
  owner: Owner;
  products: Cart;
  address: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
  totalItems: number;
  status: OrderStatus;
}

export interface GlobalState {
  user: User | null;
  products: Product[] | null;
  notifications: Notification[] | null;
}

export interface Cloudinary {
  createUploadWidget: (
    parameters: CloudinaryParameters,
    handler: CloudinaryResultHandler
  ) => {
    open: () => void;
  };
}

declare global {
  interface Window {
    cloudinary: Cloudinary;
  }
}
