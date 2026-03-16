import { create } from 'zustand';

interface FilterState {
  selectedMonth: number;
  selectedYear: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  setMonthAndYear: (month: number, year: number) => void;
}

const currentDate = new Date();

export const useFilterStore = create<FilterState>((set) => ({
  selectedMonth: currentDate.getMonth() + 1,
  selectedYear: currentDate.getFullYear(),
  setMonth: (month) => set({ selectedMonth: month }),
  setYear: (year) => set({ selectedYear: year }),
  setMonthAndYear: (month, year) => set({ selectedMonth: month, selectedYear: year }),
}));
