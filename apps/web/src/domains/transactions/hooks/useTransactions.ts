import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '@/domains/categories/stores/categoryStore';
import {
  enrichTransactionsWithCategories,
  filterTransactions,
  sortTransactionsByDateDesc,
} from '../services/transactionService';
import { useFilterStore } from '@/shared/stores/filterStore';
import type { StoredTransaction, TransactionFilters } from '../types';

export function useTransactions(additionalFilters?: Omit<TransactionFilters, 'month' | 'year'>) {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { selectedMonth, selectedYear } = useFilterStore();

  const filteredAndEnrichedTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, {
      month: selectedMonth,
      year: selectedYear,
      ...additionalFilters,
    });
    const sorted = sortTransactionsByDateDesc(filtered);
    return enrichTransactionsWithCategories(sorted, categories);
  }, [transactions, categories, selectedMonth, selectedYear, additionalFilters]);

  return {
    transactions: filteredAndEnrichedTransactions,
    total: filteredAndEnrichedTransactions.length,
  };
}

export function useTransactionById(id: string) {
  const { transactions } = useTransactionStore();
  const { categories } = useCategoryStore();

  return useMemo(() => {
    const transaction = transactions.find((t) => t.id === id) ?? null;
    if (!transaction) return null;
    return {
      ...transaction,
      category: categories.find((category) => category.id === transaction.categoryId) ?? null,
    };
  }, [transactions, categories, id]);
}

export function useAddTransaction() {
  const { addTransaction } = useTransactionStore();

  return (input: Omit<StoredTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const created = addTransaction(input);
      toast.success('Transação criada com sucesso!');
      return created;
    } catch (error) {
      toast.error('Erro ao criar transação.');
      throw error;
    }
  };
}

export function useEditTransaction() {
  const { editTransaction } = useTransactionStore();

  return (id: string, input: Partial<Omit<StoredTransaction, 'id' | 'createdAt'>>) => {
    try {
      editTransaction(id, input);
      toast.success('Transação atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar transação.');
      throw error;
    }
  };
}

export function useRemoveTransaction() {
  const { deleteTransaction } = useTransactionStore();

  return (id: string) => {
    try {
      deleteTransaction(id);
      toast.success('Transação excluída.');
    } catch (error) {
      toast.error('Erro ao excluir transação.');
      throw error;
    }
  };
}
