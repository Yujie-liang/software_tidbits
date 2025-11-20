export enum TidbitCategory {
  ALL = '隨機探索',
  FRONTEND = '前端開發',
  BACKEND = '後端架構',
  DATABASE = '資料庫',
  ALGORITHMS = '演算法',
  TESTING = '測試',
  CLOUD = '雲端計算',
  LANGUAGES = '程式語言',
  PM = '專案管理',
  DEVOPS = 'DevOps',
  CS_FUNDAMENTALS = '電腦科學基礎'
}

export interface Tidbit {
  id: string;
  title: string;
  content: string;
  explanation: string; // Advanced explanation
  code?: string;       // Code example (optional)
  category: string;
  timestamp: number;
  color: string; // Hex code for the capsule color
}

export interface TidbitResponse {
  title: string;
  content: string;
  explanation: string;
  code?: string;
  category: string;
}