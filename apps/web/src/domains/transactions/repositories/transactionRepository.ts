import { STORAGE_KEYS } from '@/shared/storage/storageKeys';
import { getAllFromStorage, saveAllToStorage } from '@/shared/storage/storageService';
import { generateId } from '@/shared/utils/idGenerator';
import type { StoredTransaction } from '../types';

export function findAllTransactions(): StoredTransaction[] {
  return getAllFromStorage<StoredTransaction>(STORAGE_KEYS.TRANSACTIONS);
}

export function findTransactionById(id: string): StoredTransaction | null {
  return findAllTransactions().find((transaction) => transaction.id === id) ?? null;
}

export function insertTransaction(
  input: Omit<StoredTransaction, 'id' | 'createdAt' | 'updatedAt'>,
): StoredTransaction {
  const existingTransactions = findAllTransactions();
  const now = new Date().toISOString();
  const newTransaction: StoredTransaction = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  saveAllToStorage(STORAGE_KEYS.TRANSACTIONS, [...existingTransactions, newTransaction]);
  return newTransaction;
}

export function updateTransaction(
  id: string,
  input: Partial<Omit<StoredTransaction, 'id' | 'createdAt'>>,
): StoredTransaction | null {
  const transactions = findAllTransactions();
  const targetIndex = transactions.findIndex((transaction) => transaction.id === id);
  if (targetIndex === -1) return null;

  const updatedTransaction: StoredTransaction = {
    ...transactions[targetIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  const updatedTransactions = transactions.map((transaction) =>
    transaction.id === id ? updatedTransaction : transaction,
  );
  saveAllToStorage(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
  return updatedTransaction;
}

export function removeTransaction(id: string): boolean {
  const transactions = findAllTransactions();
  const exists = transactions.some((transaction) => transaction.id === id);
  if (!exists) return false;
  saveAllToStorage(
    STORAGE_KEYS.TRANSACTIONS,
    transactions.filter((transaction) => transaction.id !== id),
  );
  return true;
}
