import { create } from 'zustand';
import type { Cat, CatDetail } from './types';
import * as api from './api';

interface CatStore {
  cats: Cat[];
  currentCat: CatDetail | null;
  loading: boolean;
  error: string | null;
  fetchCats: () => Promise<void>;
  fetchCat: (id: number) => Promise<void>;
  createCat: (payload: Omit<Cat, 'id'>) => Promise<Cat>;
  updateCat: (id: number, payload: Partial<Cat>) => Promise<void>;
  deleteCat: (id: number) => Promise<void>;
  addLog: (catId: number, observed_at: string, content: string) => Promise<void>;
  updateLog: (logId: number, observed_at: string, content: string) => Promise<void>;
  deleteLog: (logId: number) => Promise<void>;
  clearError: () => void;
}

export const useCatStore = create<CatStore>((set, get) => ({
  cats: [],
  currentCat: null,
  loading: false,
  error: null,

  fetchCats: async () => {
    set({ loading: true, error: null });
    try {
      const cats = await api.fetchCats();
      set({ cats, loading: false });
    } catch {
      set({ loading: false, error: '加载猫咪列表失败' });
    }
  },

  fetchCat: async (id) => {
    set({ loading: true, error: null });
    try {
      const currentCat = await api.fetchCat(id);
      set({ currentCat, loading: false });
    } catch {
      set({ loading: false, error: '加载猫咪详情失败' });
    }
  },

  createCat: async (payload) => {
    const cat = await api.createCat(payload);
    set({ cats: [...get().cats, cat] });
    return cat;
  },

  updateCat: async (id, payload) => {
    const updated = await api.updateCat(id, payload);
    set({
      cats: get().cats.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      currentCat:
        get().currentCat?.id === id ? { ...get().currentCat!, ...updated } : get().currentCat,
    });
  },

  deleteCat: async (id) => {
    await api.deleteCat(id);
    set({ cats: get().cats.filter((c) => c.id !== id) });
  },

  addLog: async (catId, observed_at, content) => {
    const log = await api.createLog(catId, { observed_at, content });
    const current = get().currentCat;
    if (current?.id === catId) {
      set({
        currentCat: {
          ...current,
          logs: [log, ...current.logs].sort(
            (a, b) => b.observed_at.localeCompare(a.observed_at) || b.id - a.id
          ),
        },
      });
    }
  },

  updateLog: async (logId, observed_at, content) => {
    const updated = await api.updateLog(logId, { observed_at, content });
    const current = get().currentCat;
    if (current) {
      set({
        currentCat: {
          ...current,
          logs: current.logs
            .map((l) => (l.id === logId ? updated : l))
            .sort((a, b) => b.observed_at.localeCompare(a.observed_at) || b.id - a.id),
        },
      });
    }
  },

  deleteLog: async (logId) => {
    await api.deleteLog(logId);
    const current = get().currentCat;
    if (current) {
      set({
        currentCat: {
          ...current,
          logs: current.logs.filter((l) => l.id !== logId),
        },
      });
    }
  },

  clearError: () => set({ error: null }),
}));
