import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface EducatorDrop {
  id: string;
  title: string;
  dropType: string;
  status: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'ENDED' | 'ARCHIVED' | 'CANCELLED';
  scheduledAt: string;
  isPublished: boolean;
  subject?: string;
  rtiTier?: string;
  learningGoal?: string;
  video?: {
    id: string;
    title: string;
    playbackId: string;
  };
  template?: {
    id: string;
    title: string;
    type: string;
  };
  schools?: Array<{
    school: {
      id: string;
      name: string;
      city: string;
      state: string;
    };
  }>;
  grades?: Array<{
    grade: {
      id: string;
      name: string;
      order: number;
    };
  }>;
  reward?: {
    rewardType: 'G3MS' | 'BRAND_REWARD';
    g3msAmount?: number;
    winnersCount: number;
    eligibilityText: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EducatorDropState {
  drops: EducatorDrop[];
  isLoading: boolean;
  error: string | null;
}

interface EducatorDropActions {
  setDrops: (drops: EducatorDrop[]) => void;
  addDrop: (drop: EducatorDrop) => void;
  updateDrop: (dropId: string, updates: Partial<EducatorDrop>) => void;
  removeDrop: (dropId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearDrops: () => void;
}

type EducatorDropStore = EducatorDropState & EducatorDropActions;

export const useEducatorDropStore = create<EducatorDropStore>()(
  persist(
    (set, get) => ({
      // State
      drops: [],
      isLoading: false,
      error: null,

      // Actions
      setDrops: (drops) => {
        set({ drops, error: null });
      },

      addDrop: (drop) => {
        set((state) => ({
          drops: [drop, ...state.drops],
          error: null
        }));
      },

      updateDrop: (dropId, updates) => {
        set((state) => ({
          drops: state.drops.map(drop => 
            drop.id === dropId ? { ...drop, ...updates } : drop
          ),
          error: null
        }));
      },

      removeDrop: (dropId) => {
        set((state) => ({
          drops: state.drops.filter(drop => drop.id !== dropId),
          error: null
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      clearDrops: () => {
        set({
          drops: [],
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'educator-drops-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        drops: state.drops
      }),
    }
  )
);