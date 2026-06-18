import axios from 'axios';
import type { FeedingRecord } from './types';

const api = axios.create({
  baseURL: '/api',
});

/** 获取所有投喂记录 */
export async function fetchRecords(): Promise<FeedingRecord[]> {
  const { data } = await api.get<FeedingRecord[]>('/feeding');
  return data;
}

/** 获取单条投喂记录详情 */
export async function fetchRecord(id: number): Promise<FeedingRecord> {
  const { data } = await api.get<FeedingRecord>(`/feeding/${id}`);
  return data;
}

/** 新建投喂记录 */
export async function createRecord(
  payload: Omit<FeedingRecord, 'id' | 'created_at'>
): Promise<FeedingRecord> {
  const { data } = await api.post<FeedingRecord>('/feeding', payload);
  return data;
}

/** 更新投喂记录 */
export async function updateRecord(
  id: number,
  payload: Partial<Omit<FeedingRecord, 'id' | 'created_at'>>
): Promise<FeedingRecord> {
  const { data } = await api.put<FeedingRecord>(`/feeding/${id}`, payload);
  return data;
}

/** 删除投喂记录 */
export async function deleteRecord(id: number): Promise<void> {
  await api.delete(`/feeding/${id}`);
}
