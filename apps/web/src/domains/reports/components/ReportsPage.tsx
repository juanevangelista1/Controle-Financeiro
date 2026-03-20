import { useState } from 'react';
import { Download, Printer, FileJson } from 'lucide-react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/shared/stores/themeStore';
import { useMonthlySummary, useCategoryBreakdown, useYearlyOverview } from '../hooks/useReports';
import { useTransactions } from '@/domains/transactions/hooks/useTransactions';
import { useCategoryStore } from '@/domains/categories/stores/categoryStore';
import { useBudgetStore } from '@/domains/budgets/stores/budgetStore';
import { useTransactionStore } from '@/domains/transactions/stores/transactionStore';
import {
	buildTransactionsCSV,
	buildFullDataJSON,
	triggerFileDownload,
	triggerPrint,
} from '../services/exportService';
import { MonthYearSelector } from '@/shared/components/MonthYearSelector';
import { EmptyState } from '@/shared/components/EmptyState';
import { formatCurrency, getMonthName } from '@/shared/utils/formatters';
import { useFilterStore } from '@/shared/stores/filterStore';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Legend,
} from 'recharts';

const CHART_COLORS = [
	'#6366F1',
	'#EC4899',
	'#10B981',
	'#F59E0B',
	'#EF4444',
	'#8B5CF6',
	'#3B82F6',
	'#F97316',
	'#14B8A6',
	'#6B7280',
];

export function ReportsPage() {
	const { selectedYear } = useFilterStore();
	const { isDarkMode } = useThemeStore();
	const [isExporting, setIsExporting] = useState(false);

	const chartTooltipStyle = {
		borderRadius: '12px',
		border: `1px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`,
		backgroundColor: isDarkMode ? '#0F172A' : '#ffffff',
		color: isDarkMode ? '#F1F5F9' : '#0F172A',
		boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
		fontSize: '13px',
		fontWeight: '500',
	};

	const chartGridColor = isDarkMode ? '#1E293B' : '#F1F5F9';
	const chartTickColor = isDarkMode ? '#64748B' : '#94A3B8';

	const summary = useMonthlySummary();
	const categoryBreakdown = useCategoryBreakdown();
	const yearlyOverview = useYearlyOverview();
	const { transactions } = useTransactions();
	const { categories } = useCategoryStore();
	const { budgets } = useBudgetStore();
	const { transactions: allTransactions } = useTransactionStore();

	const pieChartData = categoryBreakdown.map((item) => ({
		name: item.categoryName,
		value: item.totalAmount,
		color: item.categoryColor ?? '#6B7280',
	}));

	const barChartData = yearlyOverview.months.map((month) => ({
		name: getMonthName(month.month).slice(0, 3),
		receitas: month.totalIncome,
		despesas: month.totalExpense,
	}));

	function handleDownloadCSV() {
		try {
			setIsExporting(true);
			const csvContent = buildTransactionsCSV(transactions);
			triggerFileDownload(csvContent, 'transacoes.csv', 'text/csv;charset=utf-8;');
			toast.success('CSV baixado com sucesso!');
		} catch (error) {
			console.error('Erro ao gerar CSV:', error);
			toast.error('Falha ao baixar CSV.');
		} finally {
			setIsExporting(false);
		}
	}

	function handleDownloadJSON() {
		try {
			setIsExporting(true);
			const jsonContent = buildFullDataJSON({
				transactions: allTransactions,
				categories,
				budgets,
				exportedAt: new Date().toISOString(),
			});
			triggerFileDownload(jsonContent, 'controle-financeiro-backup.json', 'application/json');
			toast.success('Backup JSON baixado com sucesso!');
		} catch (error) {
			console.error('Erro ao gerar JSON:', error);
			toast.error('Falha ao baixar backup.');
		} finally {
			setIsExporting(false);
		}
	}

	function handlePrint() {
		try {
			triggerPrint();
		} catch (error) {
			console.error('Erro ao imprimir:', error);
			toast.error('Falha ao abrir impressão.');
		}
	}

	return (
		<div className='flex flex-col gap-6 animate-fade-in'>
			<div>
				<h1
					className='text-2xl font-bold tracking-tight text-surface-900 dark:text-white'
					id='reports-title'>
					Relatórios
				</h1>
				<p className='mt-1 text-sm text-surface-500 dark:text-surface-400'>
					Visualização dos seus dados financeiros
				</p>
			</div>

			<MonthYearSelector />

			{/* Monthly summary cards */}
			<div className='grid grid-cols-3 gap-3 md:gap-4'>
				<div className='rounded-2xl border border-success-200/60 bg-success-50 p-4 text-center shadow-sm dark:border-success-500/20 dark:bg-success-500/10 md:p-6'>
					<p className='text-xs font-semibold uppercase tracking-widest text-success-600 dark:text-success-400'>
						Receitas
					</p>
					<p className='mt-2 text-base font-bold tracking-tight text-success-700 dark:text-success-300 md:text-2xl'>
						{formatCurrency(summary.totalIncome)}
					</p>
				</div>
				<div className='rounded-2xl border border-danger-200/60 bg-danger-50 p-4 text-center shadow-sm dark:border-danger-500/20 dark:bg-danger-500/10 md:p-6'>
					<p className='text-xs font-semibold uppercase tracking-widest text-danger-600 dark:text-danger-400'>
						Despesas
					</p>
					<p className='mt-2 text-base font-bold tracking-tight text-danger-700 dark:text-danger-300 md:text-2xl'>
						{formatCurrency(summary.totalExpense)}
					</p>
				</div>
				<div className='rounded-2xl border border-primary-200/60 bg-primary-50 p-4 text-center shadow-sm dark:border-primary-500/20 dark:bg-primary-500/10 md:p-6'>
					<p className='text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400'>
						Saldo
					</p>
					<p className='mt-2 text-base font-bold tracking-tight text-primary-700 dark:text-primary-300 md:text-2xl'>
						{formatCurrency(summary.balance)}
					</p>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				{/* Pie chart — Expenses by category */}
				<section className='rounded-2xl border border-surface-200/80 bg-white p-6 shadow-sm dark:border-surface-800/80 dark:bg-surface-900'>
					<h2 className='mb-5 text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500'>
						Despesas por Categoria
					</h2>

					{pieChartData.length === 0 ? (
						<EmptyState message='Sem dados para exibir' />
					) : (
						<>
							<ResponsiveContainer
								width='100%'
								height={240}>
								<PieChart>
									<Pie
										data={pieChartData}
										cx='50%'
										cy='50%'
										innerRadius={55}
										outerRadius={85}
										paddingAngle={3}
										dataKey='value'
										strokeWidth={0}>
										{pieChartData.map((entry, index) => (
											<Cell
												key={entry.name}
												fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip
										formatter={(value: number) => formatCurrency(value)}
										contentStyle={chartTooltipStyle}
									/>
								</PieChart>
							</ResponsiveContainer>

							<div className='mt-4 flex flex-wrap gap-2'>
								{pieChartData.map((item) => (
									<div
										key={item.name}
										className='flex items-center gap-1.5 rounded-lg bg-surface-50 px-2.5 py-1.5 dark:bg-surface-800'>
										<div
											className='h-2.5 w-2.5 rounded-full'
											style={{ backgroundColor: item.color }}
										/>
										<span className='text-xs font-medium text-surface-600 dark:text-surface-300'>
											{item.name}
										</span>
									</div>
								))}
							</div>
						</>
					)}
				</section>

				{/* Bar chart — Yearly overview */}
				<section className='rounded-2xl border border-surface-200/80 bg-white p-6 shadow-sm dark:border-surface-800/80 dark:bg-surface-900 md:col-span-2'>
					<h2 className='mb-5 text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500'>
						Receitas vs Despesas — {selectedYear}
					</h2>

					<ResponsiveContainer
						width='100%'
						height={300}>
						<BarChart
							data={barChartData}
							barGap={4}
							barCategoryGap='30%'>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke={chartGridColor}
								vertical={false}
							/>
							<XAxis
								dataKey='name'
								tick={{ fontSize: 11, fill: chartTickColor, fontWeight: 500 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 11, fill: chartTickColor }}
								axisLine={false}
								tickLine={false}
								tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
							/>
							<Tooltip
								formatter={(value: number) => formatCurrency(value)}
								contentStyle={chartTooltipStyle}
								cursor={{ fill: isDarkMode ? '#1E293B' : '#F8FAFC', radius: 6 }}
							/>
							<Legend
								wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '16px' }}
							/>
							<Bar
								dataKey='receitas'
								fill='#10B981'
								radius={[6, 6, 0, 0]}
								name='Receitas'
							/>
							<Bar
								dataKey='despesas'
								fill='#EF4444'
								radius={[6, 6, 0, 0]}
								name='Despesas'
							/>
						</BarChart>
					</ResponsiveContainer>

					<div className='mt-6 grid grid-cols-3 gap-3 md:gap-4'>
						<div className='rounded-2xl border border-success-200/60 bg-success-50 p-4 text-center shadow-sm dark:border-success-500/20 dark:bg-success-500/10'>
							<p className='text-xs font-semibold uppercase tracking-widest text-success-600 dark:text-success-400'>
								Total Receitas
							</p>
							<p className='mt-2 text-base font-bold tracking-tight text-success-700 dark:text-success-300 md:text-xl'>
								{formatCurrency(yearlyOverview.totalIncome)}
							</p>
						</div>
						<div className='rounded-2xl border border-danger-200/60 bg-danger-50 p-4 text-center shadow-sm dark:border-danger-500/20 dark:bg-danger-500/10'>
							<p className='text-xs font-semibold uppercase tracking-widest text-danger-600 dark:text-danger-400'>
								Total Despesas
							</p>
							<p className='mt-2 text-base font-bold tracking-tight text-danger-700 dark:text-danger-300 md:text-xl'>
								{formatCurrency(yearlyOverview.totalExpense)}
							</p>
						</div>
						<div className='rounded-2xl border border-primary-200/60 bg-primary-50 p-4 text-center shadow-sm dark:border-primary-500/20 dark:bg-primary-500/10'>
							<p className='text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400'>
								Saldo Anual
							</p>
							<p className='mt-2 text-base font-bold tracking-tight text-primary-700 dark:text-primary-300 md:text-xl'>
								{formatCurrency(yearlyOverview.balance)}
							</p>
						</div>
					</div>
				</section>

				{/* Export section */}
				<section className='rounded-2xl border border-surface-200/80 bg-white p-6 shadow-sm print:hidden dark:border-surface-800/80 dark:bg-surface-900'>
					<h2 className='mb-5 text-xs font-semibold uppercase tracking-widest text-surface-400 dark:text-surface-500'>
						Exportar Dados
					</h2>
					<div className='flex flex-col gap-2.5'>
						<button
							id='export-csv-button'
							onClick={handleDownloadCSV}
							disabled={isExporting}
							className='flex cursor-pointer items-center gap-4 rounded-xl border border-surface-200 p-4 text-left transition-all hover:border-success-200 hover:bg-success-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:hover:border-success-800 dark:hover:bg-success-500/5'>
							<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success-50 dark:bg-success-500/10'>
								<Download className='h-5 w-5 text-success-600 dark:text-success-400' />
							</div>
							<div>
								<p className='text-sm font-semibold text-surface-800 dark:text-surface-200'>Baixar CSV</p>
								<p className='text-xs text-surface-400 dark:text-surface-500'>Transações do mês em planilha</p>
							</div>
						</button>

						<button
							id='export-json-button'
							onClick={handleDownloadJSON}
							disabled={isExporting}
							className='flex cursor-pointer items-center gap-4 rounded-xl border border-surface-200 p-4 text-left transition-all hover:border-primary-200 hover:bg-primary-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:hover:border-primary-800 dark:hover:bg-primary-500/5'>
							<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10'>
								<FileJson className='h-5 w-5 text-primary-600 dark:text-primary-400' />
							</div>
							<div>
								<p className='text-sm font-semibold text-surface-800 dark:text-surface-200'>Backup JSON</p>
								<p className='text-xs text-surface-400 dark:text-surface-500'>Todos os dados para backup completo</p>
							</div>
						</button>

						<button
							id='print-button'
							onClick={handlePrint}
							className='flex cursor-pointer items-center gap-4 rounded-xl border border-surface-200 p-4 text-left transition-all hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:hover:border-surface-600 dark:hover:bg-surface-800'>
							<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800'>
								<Printer className='h-5 w-5 text-surface-600 dark:text-surface-400' />
							</div>
							<div>
								<p className='text-sm font-semibold text-surface-800 dark:text-surface-200'>Imprimir</p>
								<p className='text-xs text-surface-400 dark:text-surface-500'>Abre o diálogo de impressão</p>
							</div>
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}
