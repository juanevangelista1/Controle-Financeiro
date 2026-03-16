import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Edit2, Printer, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTransactions, useRemoveTransaction } from '../hooks/useTransactions';
import { MonthYearSelector } from '@/shared/components/MonthYearSelector';
import { EmptyState } from '@/shared/components/EmptyState';
import { Modal } from '@/shared/components/Modal';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { triggerFileDownload, buildTransactionsCSV, triggerPrint } from '@/domains/reports/services/exportService';
import { TRANSACTION_TYPES } from '@controle-financeiro/shared';

export function TransactionListPage() {
  const navigate = useNavigate();
  const { transactions, total } = useTransactions();
  const removeTransaction = useRemoveTransaction();
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  function handleConfirmDelete() {
    if (!transactionToDelete) return;
    removeTransaction(transactionToDelete);
    setTransactionToDelete(null);
  }

  function handleDownloadCSV() {
    try {
      const csvContent = buildTransactionsCSV(transactions);
      triggerFileDownload(csvContent, 'transacoes.csv', 'text/csv;charset=utf-8;');
      toast.success('Download concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar arquivo CSV:', error);
      toast.error('Falha ao baixar os dados.');
    }
  }

  function handlePrint() {
    try {
      triggerPrint();
    } catch (error) {
      console.error('Erro ao acionar impressão:', error);
      toast.error('Falha ao abrir tela de impressão.');
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-surface-900 dark:text-white"
            id="transactions-title"
          >
            Transações
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Histórico detalhado
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleDownloadCSV}
            className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            title="Baixar CSV"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrint}
            className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            title="Imprimir"
          >
            <Printer className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MonthYearSelector />

      {transactions.length === 0 ? (
        <EmptyState
          message="Nenhuma transação encontrada"
          description="Adicione uma transação clicando no botão +"
        />
      ) : (
        <>
          <div className="rounded-xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900">
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
              {total} transações encontradas
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
              const amountSign = isIncome ? '+' : '-';
              const amountColorClass = isIncome
                ? 'text-success-600 dark:text-success-500'
                : 'text-danger-600 dark:text-danger-500';

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-4 transition-colors hover:bg-surface-50 dark:border-surface-800 dark:bg-surface-900 dark:hover:bg-surface-800/50"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: (transaction.category?.color ?? '#6B7280') + '15',
                    }}
                  >
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: transaction.category?.color ?? '#6B7280' }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-surface-800 dark:text-surface-200">
                        {transaction.category?.name ?? 'Sem categoria'}
                      </p>
                      <p className={`shrink-0 text-sm font-bold ${amountColorClass}`}>
                        {amountSign} {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-surface-400">
                        {formatDate(transaction.date)}
                      </span>
                      {transaction.description && (
                        <span className="truncate text-xs text-surface-400">
                          — {transaction.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1 print:hidden">
                    <button
                      id={`edit-transaction-${transaction.id}`}
                      onClick={() => navigate(`/transactions/${transaction.id}`)}
                      className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-500 dark:hover:bg-surface-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      id={`delete-transaction-${transaction.id}`}
                      onClick={() => setTransactionToDelete(transaction.id)}
                      className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <Modal
        isOpen={transactionToDelete !== null}
        onClose={() => setTransactionToDelete(null)}
        title="Confirmar exclusão"
      >
        <p className="text-sm text-surface-600 dark:text-surface-400">
          Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            id="cancel-delete-button"
            onClick={() => setTransactionToDelete(null)}
            className="flex-1 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
          >
            Cancelar
          </button>
          <button
            id="confirm-delete-button"
            onClick={handleConfirmDelete}
            className="flex-1 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-danger-600"
          >
            Excluir
          </button>
        </div>
      </Modal>
    </div>
  );
}
