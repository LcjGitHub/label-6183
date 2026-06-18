import axios from 'axios';
import type { FeedingRecord, HealthFollowup, CatSighting, AdoptionIntention, VolunteerSchedule } from './types';

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

/** 获取所有健康随访记录 */
export async function fetchHealthFollowups(): Promise<HealthFollowup[]> {
  const { data } = await api.get<HealthFollowup[]>('/health-followup');
  return data;
}

/** 获取单条健康随访记录详情 */
export async function fetchHealthFollowup(id: number): Promise<HealthFollowup> {
  const { data } = await api.get<HealthFollowup>(`/health-followup/${id}`);
  return data;
}

/** 新建健康随访记录 */
export async function createHealthFollowup(
  payload: Omit<HealthFollowup, 'id' | 'created_at'>
): Promise<HealthFollowup> {
  const { data } = await api.post<HealthFollowup>('/health-followup', payload);
  return data;
}

/** 更新健康随访记录 */
export async function updateHealthFollowup(
  id: number,
  payload: Partial<Omit<HealthFollowup, 'id' | 'created_at'>>
): Promise<HealthFollowup> {
  const { data } = await api.put<HealthFollowup>(`/health-followup/${id}`, payload);
  return data;
}

/** 删除健康随访记录 */
export async function deleteHealthFollowup(id: number): Promise<void> {
  await api.delete(`/health-followup/${id}`);
}

/** 获取所有目击标注 */
export async function fetchCatSightings(keyword?: string): Promise<CatSighting[]> {
  const params = keyword ? { keyword } : {};
  const { data } = await api.get<CatSighting[]>('/cat-sightings', { params });
  return data;
}

/** 获取单条目击标注详情 */
export async function fetchCatSighting(id: number): Promise<CatSighting> {
  const { data } = await api.get<CatSighting>(`/cat-sightings/${id}`);
  return data;
}

/** 新建目击标注 */
export async function createCatSighting(
  payload: Omit<CatSighting, 'id' | 'created_at'>
): Promise<CatSighting> {
  const { data } = await api.post<CatSighting>('/cat-sightings', payload);
  return data;
}

/** 更新目击标注 */
export async function updateCatSighting(
  id: number,
  payload: Partial<Omit<CatSighting, 'id' | 'created_at'>>
): Promise<CatSighting> {
  const { data } = await api.put<CatSighting>(`/cat-sightings/${id}`, payload);
  return data;
}

/** 删除目击标注 */
export async function deleteCatSighting(id: number): Promise<void> {
  await api.delete(`/cat-sightings/${id}`);
}

/** 获取所有领养意向 */
export async function fetchAdoptionIntentions(): Promise<AdoptionIntention[]> {
  const { data } = await api.get<AdoptionIntention[]>('/adoption');
  return data;
}

/** 获取单条领养意向详情 */
export async function fetchAdoptionIntention(id: number): Promise<AdoptionIntention> {
  const { data } = await api.get<AdoptionIntention>(`/adoption/${id}`);
  return data;
}

/** 新建领养意向 */
export async function createAdoptionIntention(
  payload: Omit<AdoptionIntention, 'id' | 'created_at'>
): Promise<AdoptionIntention> {
  const { data } = await api.post<AdoptionIntention>('/adoption', payload);
  return data;
}

/** 更新领养意向 */
export async function updateAdoptionIntention(
  id: number,
  payload: Partial<Omit<AdoptionIntention, 'id' | 'created_at'>>
): Promise<AdoptionIntention> {
  const { data } = await api.put<AdoptionIntention>(`/adoption/${id}`, payload);
  return data;
}

/** 删除领养意向 */
export async function deleteAdoptionIntention(id: number): Promise<void> {
  await api.delete(`/adoption/${id}`);
}

/** 获取所有志愿者排班 */
export async function fetchVolunteerSchedules(date?: string): Promise<VolunteerSchedule[]> {
  const params = date ? { date } : {};
  const { data } = await api.get<VolunteerSchedule[]>('/volunteer-schedule', { params });
  return data;
}

/** 获取单条志愿者排班详情 */
export async function fetchVolunteerSchedule(id: number): Promise<VolunteerSchedule> {
  const { data } = await api.get<VolunteerSchedule>(`/volunteer-schedule/${id}`);
  return data;
}

/** 新建志愿者排班 */
export async function createVolunteerSchedule(
  payload: Omit<VolunteerSchedule, 'id' | 'created_at'>
): Promise<VolunteerSchedule> {
  const { data } = await api.post<VolunteerSchedule>('/volunteer-schedule', payload);
  return data;
}

/** 更新志愿者排班 */
export async function updateVolunteerSchedule(
  id: number,
  payload: Partial<Omit<VolunteerSchedule, 'id' | 'created_at'>>
): Promise<VolunteerSchedule> {
  const { data } = await api.put<VolunteerSchedule>(`/volunteer-schedule/${id}`, payload);
  return data;
}

/** 删除志愿者排班 */
export async function deleteVolunteerSchedule(id: number): Promise<void> {
  await api.delete(`/volunteer-schedule/${id}`);
}
