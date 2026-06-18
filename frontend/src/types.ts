/** 投喂记录 */
export interface FeedingRecord {
  id: number;
  feeding_date: string;
  location: string;
  cat_food_type: string;
  quantity: string;
  weather: string | null;
  remark: string | null;
  created_at?: string;
}

/** 猫咪投喂记录 */
export interface CatFeedingRecord {
  id: number;
  cat_sighting_id: number;
  feeding_date: string;
  food_type: string;
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
  photo_url: string | null;
  coat_color: string | null;
  created_at?: string;
}

/** 领养意向登记 */
export interface AdoptionIntention {
  id: number;
  applicant_name: string;
  phone: string;
  cat_nickname: string;
  application_date: string;
  application_status: string;
  remark: string | null;
  created_at?: string;
}

/** 志愿者排班 */
export interface VolunteerSchedule {
  id: number;
  volunteer_name: string;
  duty_date: string;
  area: string;
  phone: string;
  is_arrived: number;
  remark: string | null;
  created_at?: string;
}
