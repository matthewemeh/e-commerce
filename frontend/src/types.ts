import { Result } from './interfaces';

export type ResultEvent = 'success' | 'failure';

export type CloudinaryResultHandler = (error: any, result: Result) => void;

export type OrderStatus = 'processing' | 'shipped';

export type NotificationStatus = 'unread' | 'read';
