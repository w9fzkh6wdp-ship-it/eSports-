import create from "zustand";

interface BroadcastState {
  accounts: any[];
  selectedAccount: any;
  groups: any[];
  selectedGroups: any[];
  logs: any[];
  isLoading: boolean;
  
  addAccount: (account: any) => void;
  setSelectedAccount: (account: any) => void;
  setGroups: (groups: any[]) => void;
  toggleGroup: (groupId: string) => void;
  setLogs: (logs: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useBroadcastStore = create<BroadcastState>((set) => ({
  accounts: [],
  selectedAccount: null,
  groups: [],
  selectedGroups: [],
  logs: [],
  isLoading: false,

  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),

  setSelectedAccount: (account) => set({ selectedAccount: account }),

  setGroups: (groups) => set({ groups }),

  toggleGroup: (groupId) =>
    set((state) => {
      const isSelected = state.selectedGroups.some(
        (g) => g.id === groupId
      );
      return {
        selectedGroups: isSelected
          ? state.selectedGroups.filter((g) => g.id !== groupId)
          : [
              ...state.selectedGroups,
              state.groups.find((g) => g.id === groupId),
            ],
      };
    }),

  setLogs: (logs) => set({ logs }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
