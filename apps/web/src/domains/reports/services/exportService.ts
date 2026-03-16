import type { TransactionWithCategory } from '@/domains/transactions/types';
import type { StoredTransaction } from '@/domains/transactions/types';
import type { StoredCategory } from '@/domains/categories/types';
import type { StoredBudget } from '@/domains/budgets/types';

interface FullDataExport {
  transactions: StoredTransaction[];
  categories: StoredCategory[];
  budgets: StoredBudget[];
  exportedAt: string;
}

export function buildTransactionsCSV(transactions: TransactionWithCategory[]): string {
  const csvHeaders = ['Data', 'Tipo', 'Categoria', 'Valor (R$)', 'Descrição'].join(',');

  const csvRows = transactions.map((transaction) => {
    const transactionType = transaction.type === 'INCOME' ? 'Receita' : 'Despesa';
    const categoryName = transaction.category?.name ?? '';
    const description = (transaction.description ?? '').replace(/,/g, ';');
    return [transaction.date, transactionType, categoryName, transaction.amount.toFixed(2), description].join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

export function buildFullDataJSON(data: FullDataExport): string {
  return JSON.stringify(data, null, 2);
}

export function triggerFileDownload(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = downloadUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadUrl);
}

export function triggerPrint(): void {
  window.print();
}
