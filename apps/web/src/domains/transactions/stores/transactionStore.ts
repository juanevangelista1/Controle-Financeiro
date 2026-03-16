import { create } from 'zustand';
import * as transactionRepository from '../repositories/transactionRepository';
import type { StoredTransaction } from '../types';

interface TransactionState {
  transactions: StoredTransaction[];
  addTransaction: (
    input: Omit<StoredTransaction, 'id' | 'createdAt' | 'updatedAt'>,
  ) => StoredTransaction;
  editTransaction: (
    id: string,
    input: Partial<Omit<StoredTransaction, 'id' | 'createdAt'>>,
  ) => void;
  deleteTransaction: (id: string) => void;
  refreshTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: transactionRepository.findAllTransactions(),

  addTransaction: (input) => {
    const created = transactionRepository.insertTransaction(input);
    set((state) => ({ transactions: [...state.transactions, created] }));
    return created;
  },

  editTransaction: (id, input) => {
    transactionRepository.updateTransaction(id, input);
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...input, updatedAt: new Date().toISOString() }
          : transaction,
      ),
    }));
  },

  deleteTransaction: (id) => {
    transactionRepository.removeTransaction(id);
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
    }));
  },

  refreshTransactions: () => {
    set({ transactions: transactionRepository.findAllTransactions() });
  },
}));
