// apps/web/src/domains/transactions/components/DashboardPage.tsx

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
	TrendingUp,
	TrendingDown,
	Wallet,
	ArrowRight,
	BarChart2,
	Plus,
	Calendar,
} from 'lucide-react';

import { useMonthlySummary, useCategoryBreakdown } from '@/domains/reports/hooks/useReports';
import { useTransactions } from '@/domains/transactions/hooks/useTransactions';
import { MonthYearSelector } from '@/shared/components/MonthYearSelector';
import { formatCurrency, formatDateShort, getMonthName } from '@/shared/utils/formatters';
import { useFilterStore } from '@/shared/stores/filterStore';
import { TRANSACTION_TYPES } from '@controle-financeiro/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * @description Dashboard principal com foco em KPIs financeiros e ações rápidas.
 * Aplicando princípios de Hierarquia Visual e Progressive Disclosure.
 */
export function DashboardPage() {
	const navigate = useNavigate();
	const { selectedMonth, selectedYear } = useFilterStore();

	const summary = useMonthlySummary();
	const categoryBreakdown = useCategoryBreakdown();
	const { transactions } = useTransactions();

	// Constantes de UI extraídas para evitar "magic numbers"
	const LIMITS = { RECENT: 5, CATEGORIES: 5 };

	const recentTransactions = useMemo(() => transactions.slice(0, LIMITS.RECENT), [transactions]);

	const topCategories = useMemo(
		() => categoryBreakdown.slice(0, LIMITS.CATEGORIES),
		[categoryBreakdown],
	);

	const monthLabel = getMonthName(selectedMonth);

	const savingsRate = useMemo(() => {
		if (summary.totalIncome <= 0) return 0;
		return Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100);
	}, [summary.totalIncome, summary.totalExpense]);

	return (
		<div className='flex flex-col gap-8 animate-fade-in py-4 justify-center max-w-5xl mx-auto'>
			{/* 1. Header & Contextual Actions */}
			<header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white'>
						Controle Financeiro 🤑
					</h1>
					<div className='flex items-center gap-2 mt-1 text-surface-500 dark:text-surface-400'>
						<Calendar className='h-4 w-4' />
						<span className='text-sm font-medium'>
							{monthLabel}, {selectedYear}
						</span>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => navigate('/reports')}
						className='hidden md:flex h-10 w-40'>
						<BarChart2 className='mr-2 h-4 w-4' />
						Relatórios Detalhados
					</Button>
				</div>
			</header>

			{/* 2. Global Filter */}
			<section>
				<MonthYearSelector />
			</section>

			{/* 3. Key Performance Indicators (KPIs) */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Main Balance Card - Hero Section */}
				<Card className='lg:col-span-2 overflow-hidden border-none bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-xl'>
					<CardContent className='m-8 flex justify-between items-center'>
						<div className='space-y-4 p-6'>
							<p className='text-primary-100 font-medium flex items-center gap-2'>
								<Wallet className='h-4 w-4' /> Saldo Disponível
							</p>
							<h2 className='text-5xl font-bold tracking-tighter'>{formatCurrency(summary.balance)}</h2>
							<div className='flex items-center gap-3'>
								<span className='bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md'>
									{summary.transactionCount} Movimentações
								</span>
								{summary.totalIncome > 0 && (
									<span
										className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${savingsRate >= 0 ? 'bg-success-500/30' : 'bg-danger-500/30'}`}>
										{savingsRate >= 0
											? `Taxa de Poupança: ${savingsRate}%`
											: `Déficit: ${Math.abs(savingsRate)}%`}
									</span>
								)}
							</div>
						</div>
						<div className='hidden sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 rotate-12'>
							<Wallet className='h-10 w-10 text-white/50' />
						</div>
					</CardContent>
				</Card>

				{/* Secondary KPIs */}
				<div className='flex flex-col gap-4'>
					<Card className='bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='h-12 w-12 rounded-xl bg-success-50 dark:bg-success-500/10 flex items-center justify-center'>
								<TrendingUp className='text-success-600 h-6 w-6' />
							</div>
							<div>
								<p className='text-sm font-medium text-surface-500'>Receitas</p>
								<p className='text-xl font-bold text-success-600'>{formatCurrency(summary.totalIncome)}</p>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800'>
						<CardContent className='p-5 flex items-center gap-4'>
							<div className='h-12 w-12 rounded-xl bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center'>
								<TrendingDown className='text-danger-600 h-6 w-6' />
							</div>
							<div>
								<p className='text-sm font-medium text-surface-500'>Despesas</p>
								<p className='text-xl font-bold text-danger-600'>{formatCurrency(summary.totalExpense)}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* 4. Insights & Detail Data */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
				{/* Category Insights */}
				<section className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h3 className='text-lg font-bold text-surface-800 dark:text-surface-100'>
							Distribuição de Gastos
						</h3>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => navigate('/reports')}
							className='text-primary-600'>
							Análise completa <ArrowRight className='ml-1 h-4 w-4' />
						</Button>
					</div>

					<Card className='border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm'>
						<CardContent className='p-6'>
							{topCategories.length > 0 ? (
								<div className='space-y-6'>
									{topCategories.map((item) => (
										<div
											key={item.categoryId}
											className='group'>
											<div className='flex justify-between items-center mb-2'>
												<span className='text-sm font-semibold text-surface-700 dark:text-surface-300 flex items-center gap-2'>
													<div
														className='h-2 w-2 rounded-full'
														style={{ backgroundColor: item.categoryColor ?? '#6B7280' }}
													/>
													{item.categoryName}
												</span>
												<span className='text-sm font-bold text-surface-900 dark:text-surface-100'>
													{formatCurrency(item.totalAmount)}
												</span>
											</div>
											<div className='h-2 w-full bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden'>
												<div
													className='h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110'
													style={{
														width: `${item.percentage}%`,
														backgroundColor: item.categoryColor ?? '#6B7280',
													}}
												/>
											</div>
											<p className='text-[15px] text-right m-5 text-surface-400 font-medium uppercase tracking-wider'>
												{item.percentage}% do total
											</p>
										</div>
									))}
								</div>
							) : (
								<p className='text-center p-8 text-surface-400 text-sm italic'>
									Nenhum dado de categoria disponível.
								</p>
							)}
						</CardContent>
					</Card>
				</section>

				{/* Recent Transactions List */}
				<section className='space-y-4'>
					<div className='flex items-center justify-between'>
						<h3 className='text-lg font-bold text-surface-800 dark:text-surface-100'>
							Transações Recentes
						</h3>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => navigate('/transactions')}
							className='text-primary-600'>
							Ver histórico <ArrowRight className='ml-1 h-4 w-4' />
						</Button>
					</div>

					<Card className='border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm overflow-hidden'>
						<div className='divide-y divide-surface-100 dark:divide-surface-800'>
							{recentTransactions.length > 0 ? (
								recentTransactions.map((t) => (
									<div
										key={t.id}
										className='flex items-center p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer'
										onClick={() => navigate(`/transactions/${t.id}`)}>
										<div
											className='h-10 w-10 rounded-full flex items-center justify-center mr-4'
											style={{ backgroundColor: (t.category?.color ?? '#6B7280') + '15' }}>
											<div
												className='h-2 w-2 rounded-full'
												style={{ backgroundColor: t.category?.color ?? '#6B7280' }}
											/>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-sm font-bold text-surface-900 dark:text-white truncate'>
												{t.category?.name || 'Sem Categoria'}
											</p>
											<p className='text-xs text-surface-500 truncate'>
												{formatDateShort(t.date)} {t.description && `• ${t.description}`}
											</p>
										</div>
										<div
											className={`text-sm font-black ${t.type === TRANSACTION_TYPES.INCOME ? 'text-success-600' : 'text-danger-600'}`}>
											{t.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
										</div>
									</div>
								))
							) : (
								<div className='p-12 text-center text-surface-400 text-sm'>
									Nenhuma transação registrada.
								</div>
							)}
						</div>
					</Card>
				</section>
			</div>
		</div>
	);
}
