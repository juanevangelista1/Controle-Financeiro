import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, Edit2, Printer, Download, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTransactions, useRemoveTransaction } from '../hooks/useTransactions';
import { MonthYearSelector } from '@/shared/components/MonthYearSelector';
import { EmptyState } from '@/shared/components/EmptyState';
import { Modal } from '@/shared/components/Modal';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import {
	triggerFileDownload,
	buildTransactionsCSV,
	triggerPrint,
} from '@/domains/reports/services/exportService';
import { TRANSACTION_TYPES } from '@controle-financeiro/shared';

export function TransactionListPage() {
	const navigate = useNavigate();
	const { transactions, total } = useTransactions();
	const removeTransaction = useRemoveTransaction();
	const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

	const totalIncome = transactions
		.filter((t) => t.type === TRANSACTION_TYPES.INCOME)
		.reduce((sum, t) => sum + t.amount, 0);

	const totalExpense = transactions
		.filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
		.reduce((sum, t) => sum + t.amount, 0);

	function handleConfirmDelete() {
		if (!transactionToDelete) return;
		removeTransaction(transactionToDelete);
		setTransactionToDelete(null);
		toast.success('Transação excluída.');
	}

	function handleDownloadCSV() {
		try {
			const csvContent = buildTransactionsCSV(transactions);
			triggerFileDownload(csvContent, 'transacoes.csv', 'text/csv;charset=utf-8;');
			toast.success('Download concluído!');
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
		<div className='flex flex-col gap-6 animate-fade-in'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1
						className='text-2xl font-bold text-surface-900 dark:text-white'
						id='transactions-title'>
						Transações
					</h1>
					<p className='mt-0.5 text-sm text-surface-500 dark:text-surface-400'>
						{total > 0 ? `${total} registros encontrados` : 'Histórico detalhado'}
					</p>
				</div>
				<div className='flex items-center gap-2 print:hidden'>
					<button
						onClick={handleDownloadCSV}
						className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-surface-200 text-surface-500 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800'
						title='Baixar CSV'
						aria-label='Baixar CSV'>
						<Download className='h-5 w-5' />
					</button>
					<button
						onClick={handlePrint}
						className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-surface-200 text-surface-500 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800'
						title='Imprimir'
						aria-label='Imprimir'>
						<Printer className='h-5 w-5' />
					</button>
				</div>
			</div>

			<MonthYearSelector />

			{transactions.length === 0 ? (
				<EmptyState
					message='Nenhuma transação encontrada'
					description='Adicione uma transação clicando no botão +'
				/>
			) : (
				<>
					{/* Summary bar */}
					<div className='grid grid-cols-2 gap-4 md:gap-6'>
						<div className='flex items-center gap-3 rounded-2xl bg-success-50 px-4 py-3 dark:bg-success-500/10 md:p-5'>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/20 md:h-12 md:w-12'>
								<TrendingUp className='h-5 w-5 text-success-600 dark:text-success-400 md:h-6 md:w-6' />
							</div>
							<div>
								<p className='text-xs font-medium text-success-600 dark:text-success-400 md:text-sm'>
									Receitas
								</p>
								<p className='text-base font-bold text-success-700 dark:text-success-300 md:text-xl'>
									{formatCurrency(totalIncome)}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3 rounded-2xl bg-danger-50 px-4 py-3 dark:bg-danger-500/10 md:p-5'>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger-100 dark:bg-danger-500/20 md:h-12 md:w-12'>
								<TrendingDown className='h-5 w-5 text-danger-600 dark:text-danger-400 md:h-6 md:w-6' />
							</div>
							<div>
								<p className='text-xs font-medium text-danger-600 dark:text-danger-400 md:text-sm'>
									Despesas
								</p>
								<p className='text-base font-bold text-danger-700 dark:text-danger-300 md:text-xl'>
									{formatCurrency(totalExpense)}
								</p>
							</div>
						</div>
					</div>

					{/* Transaction list */}
					<div className='flex flex-col gap-3 md:gap-4'>
						{transactions.map((transaction) => {
							const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
							const amountSign = isIncome ? '+' : '-';
							const amountColorClass = isIncome
								? 'text-success-600 dark:text-success-500'
								: 'text-danger-600 dark:text-danger-500';

							return (
								<div
									key={transaction.id}
									className='flex items-center gap-4 rounded-2xl border border-surface-200 bg-white p-4 transition-colors hover:bg-surface-50 dark:border-surface-800 dark:bg-surface-900 dark:hover:bg-surface-800/50 md:p-5'>
									<div
										className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'
										style={{
											backgroundColor: (transaction.category?.color ?? '#6B7280') + '20',
										}}>
										<div
											className='h-3 w-3 rounded-full'
											style={{ backgroundColor: transaction.category?.color ?? '#6B7280' }}
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center justify-between gap-2'>
											<p className='truncate text-base font-medium text-surface-800 dark:text-surface-200 md:text-lg'>
												{transaction.category?.name ?? 'Sem categoria'}
											</p>
											<p className={`shrink-0 text-base font-bold md:text-lg ${amountColorClass}`}>
												{amountSign} {formatCurrency(transaction.amount)}
											</p>
										</div>
										<div className='mt-1 flex items-center gap-2'>
											<span className='text-sm text-surface-400'>{formatDate(transaction.date)}</span>
											{transaction.description && (
												<span className='truncate text-sm text-surface-400'>· {transaction.description}</span>
											)}
										</div>
									</div>

									<div className='flex shrink-0 gap-1 print:hidden'>
										<button
											id={`edit-transaction-${transaction.id}`}
											onClick={() => navigate(`/transactions/${transaction.id}`)}
											className='cursor-pointer rounded-lg p-2.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-primary-500 dark:hover:bg-surface-800'
											aria-label='Editar'>
											<Edit2 className='h-5 w-5' />
										</button>
										<button
											id={`delete-transaction-${transaction.id}`}
											onClick={() => setTransactionToDelete(transaction.id)}
											className='cursor-pointer rounded-lg p-2.5 text-surface-400 transition-colors hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10'
											aria-label='Excluir'>
											<Trash2 className='h-5 w-5' />
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
				title='Confirmar exclusão'>
				<p className='text-sm text-surface-600 dark:text-surface-400'>
					Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
				</p>
				<div className='mt-4 flex gap-3'>
					<button
						id='cancel-delete-button'
						onClick={() => setTransactionToDelete(null)}
						className='flex-1 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300'>
						Cancelar
					</button>
					<button
						id='confirm-delete-button'
						onClick={handleConfirmDelete}
						className='flex-1 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-danger-600'>
						Excluir
					</button>
				</div>
			</Modal>
		</div>
	);
}
