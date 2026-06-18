/** 猫咪档案 */
export interface Cat {
  id: number;
  nickname: string;
  fur_color: string;
  location: string;
  personality: string;
  created_at?: string;
  log_count?: number;
}

/** 观察日志 */
export interface ObservationLog {
  id: number;
  cat_id: number;
  observed_at: string;
  content: string;
  created_at?: string;
}

/** 猫咪详情（含日志列表） */
export interface CatDetail extends Cat {
  logs: ObservationLog[];
}
