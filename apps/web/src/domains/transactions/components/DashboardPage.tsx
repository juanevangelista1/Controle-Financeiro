import { TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMonthlySummary, useCategoryBreakdown } from '@/domains/reports/hooks/useReports';
import { useTransactions } from '@/domains/transactions/hooks/useTransactions';
import { MonthYearSelector } from '@/shared/components/MonthYearSelector';
import { formatCurrency, formatDateShort, getMonthName } from '@/shared/utils/formatters';
import { useFilterStore } from '@/shared/stores/filterStore';
import { TRANSACTION_TYPES } from '@controle-financeiro/shared';

const RECENT_TRANSACTIONS_LIMIT = 5;
const CATEGORY_BREAKDOWN_LIMIT = 5;

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { selectedMonth, selectedYear } = useFilterStore();

  const summary = useMonthlySummary();
  const categoryBreakdown = useCategoryBreakdown();
  const { transactions } = useTransactions();

  const recentTransactions = transactions.slice(0, RECENT_TRANSACTIONS_LIMIT);
  const topCategories = categoryBreakdown.slice(0, CATEGORY_BREAKDOWN_LIMIT);
  const monthLabel = getMonthName(selectedMonth);
  const greeting = getTimeGreeting();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-primary-500 dark:text-primary-400">
          {greeting}
        </p>
        <h1
          className="mt-0.5 text-2xl font-bold text-surface-900 dark:text-white"
          id="dashboard-title"
        >
          Controle Financeiro
        </h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          {monthLabel} de {selectedYear}
        </p>
      </div>

      <MonthYearSelector />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3">
        <button
          id="balance-card"
          onClick={() => navigate('/transactions')}
          className="group flex items-center justify-between rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 p-5 text-left text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]"
        >
          <div>
            <p className="text-sm font-medium text-primary-100">Saldo do mês</p>
            <p className="mt-1 text-2xl font-bold">{formatCurrency(summary.balance)}</p>
            <p className="mt-1 text-xs text-primary-200">
              {summary.transactionCount} transações
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Wallet className="h-6 w-6" />
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="flex flex-col rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
            id="income-card"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10">
                <TrendingUp className="h-4 w-4 text-success-500" />
              </div>
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                Receitas
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-success-600 dark:text-success-500">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>

          <div
            className="flex flex-col rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900"
            id="expense-card"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-50 dark:bg-danger-500/10">
                <TrendingDown className="h-4 w-4 text-danger-500" />
              </div>
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                Despesas
              </span>
            </div>
            <p className="mt-2 text-lg font-bold text-danger-600 dark:text-danger-500">
              {formatCurrency(summary.totalExpense)}
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {topCategories.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
            Gastos por Categoria
          </h2>
          <div className="flex flex-col gap-2">
            {topCategories.map((item) => (
              <div
                key={item.categoryId}
                className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900"
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.categoryColor ?? '#6B7280' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
                      {item.categoryName}
                    </span>
                    <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {formatCurrency(item.totalAmount)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.categoryColor ?? '#6B7280',
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-surface-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Transactions */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300">
            Transações Recentes
          </h2>
          <button
            id="view-all-transactions"
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600"
          >
            Ver todas <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-surface-300 p-6 text-center dark:border-surface-700">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Nenhuma transação neste mês
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentTransactions.map((transaction) => {
              const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
              const amountSign = isIncome ? '+' : '-';
              const amountColorClass = isIncome
                ? 'text-success-600 dark:text-success-500'
                : 'text-danger-600 dark:text-danger-500';

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-3 dark:border-surface-800 dark:bg-surface-900"
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
                    <p className="truncate text-sm font-medium text-surface-800 dark:text-surface-200">
                      {transaction.category?.name ?? 'Sem categoria'}
                    </p>
                    <p className="text-xs text-surface-400">
                      {formatDateShort(transaction.date)}
                    </p>
                  </div>
                  <p className={`text-sm font-semibold ${amountColorClass}`}>
                    {amountSign} {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
