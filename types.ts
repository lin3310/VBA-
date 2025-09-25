
export enum AppMode {
  EXPLAIN = 'EXPLAIN',
  GENERATE = 'GENERATE',
  DEBUG = 'DEBUG',
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
