/** 投喂记录 */
export interface FeedingRecord {
  id: number;
  feeding_date: string;
  location: string;
  cat_food_type: string;
  quantity: string;
  remark: string | null;
  created_at?: string;
}

/** 健康随访记录 */
export interface HealthFollowup {
  id: number;
  cat_nickname: string;
  followup_date: string;
  weight: number;
  mental_status: string;
  went_doctor: number;
  remark: string | null;
  created_at?: string;
}
