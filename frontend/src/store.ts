import { create } from 'zustand';
import type { FeedingRecord, HealthFollowup, CatSighting, AdoptionIntention, VolunteerSchedule } from './types';
import * as api from './api';

interface FeedingStore {
  records: FeedingRecord[];
  currentRecord: FeedingRecord | null;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  fetchRecord: (id: number) => Promise<void>;
  createRecord: (payload: Omit<FeedingRecord, 'id' | 'created_at'>) => Promise<FeedingRecord>;
  updateRecord: (
    id: number,
    payload: Partial<Omit<FeedingRecord, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useFeedingStore = create<FeedingStore>((set, get) => ({
  records: [],
  currentRecord: null,
  listLoading: false,
  detailLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ listLoading: true, error: null });
    try {
      const records = await api.fetchRecords();
      set({ records, listLoading: false });
    } catch {
      set({ listLoading: false, error: '加载投喂记录列表失败' });
    }
  },

  fetchRecord: async (id) => {
    set({ detailLoading: true, error: null, currentRecord: null });
    try {
      const currentRecord = await api.fetchRecord(id);
      set({ currentRecord, detailLoading: false });
    } catch {
      set({ detailLoading: false, error: '加载投喂记录详情失败' });
    }
  },

  createRecord: async (payload) => {
    const record = await api.createRecord(payload);
    set({
      records: [record, ...get().records].sort(
        (a, b) => b.feeding_date.localeCompare(a.feeding_date) || b.id - a.id
      ),
    });
    return record;
  },

  updateRecord: async (id, payload) => {
    const updated = await api.updateRecord(id, payload);
    set({
      records: get().records.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      currentRecord: get().currentRecord?.id === id ? updated : get().currentRecord,
    });
  },

  deleteRecord: async (id) => {
    await api.deleteRecord(id);
    set({
      records: get().records.filter((r) => r.id !== id),
      currentRecord: get().currentRecord?.id === id ? null : get().currentRecord,
    });
  },

  clearError: () => set({ error: null }),
}));

interface HealthFollowupStore {
  records: HealthFollowup[];
  currentRecord: HealthFollowup | null;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  fetchRecord: (id: number) => Promise<void>;
  createRecord: (payload: Omit<HealthFollowup, 'id' | 'created_at'>) => Promise<HealthFollowup>;
  updateRecord: (
    id: number,
    payload: Partial<Omit<HealthFollowup, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useHealthFollowupStore = create<HealthFollowupStore>((set, get) => ({
  records: [],
  currentRecord: null,
  listLoading: false,
  detailLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ listLoading: true, error: null });
    try {
      const records = await api.fetchHealthFollowups();
      set({ records, listLoading: false });
    } catch {
      set({ listLoading: false, error: '加载健康随访记录列表失败' });
    }
  },

  fetchRecord: async (id) => {
    set({ detailLoading: true, error: null, currentRecord: null });
    try {
      const currentRecord = await api.fetchHealthFollowup(id);
      set({ currentRecord, detailLoading: false });
    } catch {
      set({ detailLoading: false, error: '加载健康随访记录详情失败' });
    }
  },

  createRecord: async (payload) => {
    const record = await api.createHealthFollowup(payload);
    set({
      records: [record, ...get().records].sort(
        (a, b) => b.followup_date.localeCompare(a.followup_date) || b.id - a.id
      ),
    });
    return record;
  },

  updateRecord: async (id, payload) => {
    const updated = await api.updateHealthFollowup(id, payload);
    set({
      records: get().records.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      currentRecord: get().currentRecord?.id === id ? updated : get().currentRecord,
    });
  },

  deleteRecord: async (id) => {
    await api.deleteHealthFollowup(id);
    set({
      records: get().records.filter((r) => r.id !== id),
      currentRecord: get().currentRecord?.id === id ? null : get().currentRecord,
    });
  },

  clearError: () => set({ error: null }),
}));

interface CatSightingStore {
  records: CatSighting[];
  currentRecord: CatSighting | null;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  searchKeyword: string;
  fetchRecords: (keyword?: string) => Promise<void>;
  fetchRecord: (id: number) => Promise<void>;
  createRecord: (payload: Omit<CatSighting, 'id' | 'created_at'>) => Promise<void>;
  updateRecord: (
    id: number,
    payload: Partial<Omit<CatSighting, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  clearError: () => void;
  setSearchKeyword: (keyword: string) => void;
}

export const useCatSightingStore = create<CatSightingStore>((set, get) => ({
  records: [],
  currentRecord: null,
  listLoading: false,
  detailLoading: false,
  error: null,
  searchKeyword: '',

  fetchRecords: async (keyword) => {
    set({ listLoading: true, error: null });
    try {
      const records = await api.fetchCatSightings(keyword);
      set({ records, listLoading: false });
    } catch {
      set({ listLoading: false, error: '加载目击标注列表失败' });
    }
  },

  fetchRecord: async (id) => {
    set({ detailLoading: true, error: null, currentRecord: null });
    try {
      const currentRecord = await api.fetchCatSighting(id);
      set({ currentRecord, detailLoading: false });
    } catch {
      set({ detailLoading: false, error: '加载目击标注详情失败' });
    }
  },

  createRecord: async (payload) => {
    await api.createCatSighting(payload);
    await get().fetchRecords(get().searchKeyword);
  },

  updateRecord: async (id, payload) => {
    const updated = await api.updateCatSighting(id, payload);
    set({
      records: get().records.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      currentRecord: get().currentRecord?.id === id ? updated : get().currentRecord,
    });
  },

  deleteRecord: async (id) => {
    await api.deleteCatSighting(id);
    set({
      records: get().records.filter((r) => r.id !== id),
      currentRecord: get().currentRecord?.id === id ? null : get().currentRecord,
    });
  },

  clearError: () => set({ error: null }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
}));

interface AdoptionStore {
  records: AdoptionIntention[];
  currentRecord: AdoptionIntention | null;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  fetchRecord: (id: number) => Promise<void>;
  createRecord: (payload: Omit<AdoptionIntention, 'id' | 'created_at'>) => Promise<AdoptionIntention>;
  updateRecord: (
    id: number,
    payload: Partial<Omit<AdoptionIntention, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useAdoptionStore = create<AdoptionStore>((set, get) => ({
  records: [],
  currentRecord: null,
  listLoading: false,
  detailLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ listLoading: true, error: null });
    try {
      const records = await api.fetchAdoptionIntentions();
      set({ records, listLoading: false });
    } catch {
      set({ listLoading: false, error: '加载领养意向列表失败' });
    }
  },

  fetchRecord: async (id) => {
    set({ detailLoading: true, error: null, currentRecord: null });
    try {
      const currentRecord = await api.fetchAdoptionIntention(id);
      set({ currentRecord, detailLoading: false });
    } catch {
      set({ detailLoading: false, error: '加载领养意向详情失败' });
    }
  },

  createRecord: async (payload) => {
    const record = await api.createAdoptionIntention(payload);
    set({
      records: [record, ...get().records].sort(
        (a, b) => b.application_date.localeCompare(a.application_date) || b.id - a.id
      ),
    });
    return record;
  },

  updateRecord: async (id, payload) => {
    const updated = await api.updateAdoptionIntention(id, payload);
    set({
      records: get().records.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      currentRecord: get().currentRecord?.id === id ? updated : get().currentRecord,
    });
  },

  deleteRecord: async (id) => {
    await api.deleteAdoptionIntention(id);
    set({
      records: get().records.filter((r) => r.id !== id),
      currentRecord: get().currentRecord?.id === id ? null : get().currentRecord,
    });
  },

  clearError: () => set({ error: null }),
}));

interface VolunteerScheduleStore {
  records: VolunteerSchedule[];
  currentRecord: VolunteerSchedule | null;
  listLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  fetchRecords: (date?: string) => Promise<void>;
  fetchRecord: (id: number) => Promise<void>;
  createRecord: (payload: Omit<VolunteerSchedule, 'id' | 'created_at'>) => Promise<VolunteerSchedule>;
  updateRecord: (
    id: number,
    payload: Partial<Omit<VolunteerSchedule, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteRecord: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useVolunteerScheduleStore = create<VolunteerScheduleStore>((set, get) => ({
  records: [],
  currentRecord: null,
  listLoading: false,
  detailLoading: false,
  error: null,

  fetchRecords: async (date) => {
    set({ listLoading: true, error: null });
    try {
      const records = await api.fetchVolunteerSchedules(date);
      set({ records, listLoading: false });
    } catch {
      set({ listLoading: false, error: '加载志愿者排班列表失败' });
    }
  },

  fetchRecord: async (id) => {
    set({ detailLoading: true, error: null, currentRecord: null });
    try {
      const currentRecord = await api.fetchVolunteerSchedule(id);
      set({ currentRecord, detailLoading: false });
    } catch {
      set({ detailLoading: false, error: '加载志愿者排班详情失败' });
    }
  },

  createRecord: async (payload) => {
    const record = await api.createVolunteerSchedule(payload);
    set({
      records: [...get().records, record].sort(
        (a, b) => a.duty_date.localeCompare(b.duty_date) || a.id - b.id
      ),
    });
    return record;
  },

  updateRecord: async (id, payload) => {
    const updated = await api.updateVolunteerSchedule(id, payload);
    set({
      records: get().records.map((r) => (r.id === id ? { ...r, ...updated } : r)),
      currentRecord: get().currentRecord?.id === id ? updated : get().currentRecord,
    });
  },

  deleteRecord: async (id) => {
    await api.deleteVolunteerSchedule(id);
    set({
      records: get().records.filter((r) => r.id !== id),
      currentRecord: get().currentRecord?.id === id ? null : get().currentRecord,
    });
  },

  clearError: () => set({ error: null }),
}));
