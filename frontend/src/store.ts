import { create } from 'zustand';
import type { FeedingRecord } from './types';
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
