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

/** 流浪猫目击标注 */
export interface CatSighting {
  id: number;
  cat_nickname: string;
  latitude: number;
  longitude: number;
  sighting_time: string;
  location_description: string;
  created_at?: string;
}
