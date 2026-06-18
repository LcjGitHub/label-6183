import axios from 'axios';
import type { Cat, CatDetail, ObservationLog } from './types';

const api = axios.create({
  baseURL: '/api',
});

/** 获取所有猫咪 */
export async function fetchCats(): Promise<Cat[]> {
  const { data } = await api.get<Cat[]>('/cats');
  return data;
}

/** 获取猫咪详情 */
export async function fetchCat(id: number): Promise<CatDetail> {
  const { data } = await api.get<CatDetail>(`/cats/${id}`);
  return data;
}

/** 新建猫咪 */
export async function createCat(payload: Omit<Cat, 'id'>): Promise<Cat> {
  const { data } = await api.post<Cat>('/cats', payload);
  return data;
}

/** 更新猫咪 */
export async function updateCat(id: number, payload: Partial<Cat>): Promise<Cat> {
  const { data } = await api.put<Cat>(`/cats/${id}`, payload);
  return data;
}

/** 删除猫咪 */
export async function deleteCat(id: number): Promise<void> {
  await api.delete(`/cats/${id}`);
}

/** 新增观察日志 */
export async function createLog(
  catId: number,
  payload: { observed_at: string; content: string }
): Promise<ObservationLog> {
  const { data } = await api.post<ObservationLog>(`/logs/cat/${catId}`, payload);
  return data;
}

/** 更新观察日志 */
export async function updateLog(
  id: number,
  payload: Partial<Pick<ObservationLog, 'observed_at' | 'content'>>
): Promise<ObservationLog> {
  const { data } = await api.put<ObservationLog>(`/logs/${id}`, payload);
  return data;
}

/** 删除观察日志 */
export async function deleteLog(id: number): Promise<void> {
  await api.delete(`/logs/${id}`);
}
