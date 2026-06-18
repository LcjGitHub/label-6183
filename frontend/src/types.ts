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
