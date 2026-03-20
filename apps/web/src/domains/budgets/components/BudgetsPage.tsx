import { useState } from 'react';
import { Plus, Trash2, Target, AlertCircle } from 'lucide-react';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '@/domains/categories/hooks/useCategories';
import { MonthYearSelector } from '@/shared/components/MonthYearSelector';
import { Modal } from '@/shared/components/Modal';
import { EmptyState } from '@/shared/components/EmptyState';
import { formatCurrency } from '@/shared/utils/formatters';
import { useFilterStore } from '@/shared/stores/filterStore';
import { TRANSACTION_TYPES } from '@controle-financeiro/shared';
import toast from 'react-hot-toast';

interface BudgetFormState {
  categoryId: string;
  amount: string;
}

const INITIAL_BUDGET_FORM: BudgetFormState = {
  categoryId: '',
  amount: '',
};

const BUDGET_WARNING_THRESHOLD = 80;
const BUDGET_DANGER_THRESHOLD = 100;

export function BudgetsPage() {
  const { selectedMonth, selectedYear } = useFilterStore();
  const { budgets, upsertBudget, deleteBudget } = useBudgets();
  const { categories } = useCategories(TRANSACTION_TYPES.EXPENSE);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);
  const [formState, setFormState] = useState<BudgetFormState>(INITIAL_BUDGET_FORM);

  function handleOpenFormModal() {
    setFormState(INITIAL_BUDGET_FORM);
    setIsFormModalOpen(true);
  }

  function handleCloseFormModal() {
    setIsFormModalOpen(false);
    setFormState(INITIAL_BUDGET_FORM);
  }

  function updateFormField(field: keyof BudgetFormState, value: string) {
    setFormState((previousState) => ({ ...previousState, [field]: value }));
  }

  function handleSubmitBudget(event: React.FormEvent) {
    event.preventDefault();

    const parsedAmount = parseFloat(formState.amount);

    if (!formState.categoryId) {
      toast.error('Selecione uma categoria.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Insira um valor válido.');
      return;
    }

    upsertBudget({
      categoryId: formState.categoryId,
      amount: parsedAmount,
      month: selectedMonth,
      year: selectedYear,
    });

    handleCloseFormModal();
  }

  function handleConfirmDelete() {
    if (!budgetToDelete) return;
    deleteBudget(budgetToDelete);
    setBudgetToDelete(null);
  }

  function getBudgetBarColor(percentage: number): string {
    if (percentage >= BUDGET_DANGER_THRESHOLD) return 'bg-danger-500';
    if (percentage >= BUDGET_WARNING_THRESHOLD) return 'bg-warning-500';
    return 'bg-success-500';
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-surface-900 dark:text-white"
            id="budgets-title"
          >
            Orçamentos
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
            Metas de gastos por categoria
          </p>
        </div>
        <button
          id="add-budget-button"
          onClick={handleOpenFormModal}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Novo
        </button>
      </div>

      <MonthYearSelector />

      {budgets.length === 0 ? (
        <EmptyState
          message="Nenhum orçamento definido"
          description="Toque em Novo para definir limites de gasto por categoria"
        />
      ) : (
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-3">
          {budgets.map((budget) => {
            const budgetBarColorClass = getBudgetBarColor(budget.percentage);
            const isOverBudget = budget.percentage >= BUDGET_DANGER_THRESHOLD;

            return (
              <div
                key={budget.id}
                className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: (budget.category?.color ?? '#6B7280') + '20',
                      }}
                    >
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: budget.category?.color ?? '#6B7280' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-surface-800 dark:text-surface-200">
                        {budget.category?.name ?? 'Categoria desconhecida'}
                      </p>
                      <p className="text-sm text-surface-400">
                        {formatCurrency(budget.spent)} de {formatCurrency(budget.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isOverBudget && (
                      <AlertCircle className="h-5 w-5 text-danger-500" aria-label="Limite excedido" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        isOverBudget ? 'text-danger-600' : 'text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      {budget.percentage}%
                    </span>
                    <button
                      id={`delete-budget-${budget.id}`}
                      onClick={() => setBudgetToDelete(budget.id)}
                      className="cursor-pointer rounded-lg p-2 text-surface-400 transition-colors hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-500/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${budgetBarColorClass}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      {/* Budget summary */}
      {(() => {
        const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
        const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
        const totalRemaining = totalBudgeted - totalSpent;
        const isOverall = totalSpent > totalBudgeted;

        return (
          <div className="h-fit">
          <section className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900 md:sticky md:top-24">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary-500" />
              <h2 className="text-base font-semibold text-surface-700 dark:text-surface-300">
                Resumo do Mês
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-col md:gap-4">
              <div className="rounded-xl bg-surface-50 p-4 dark:bg-surface-800">
                <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Orçado</p>
                <p className="mt-2 text-base font-bold text-surface-800 dark:text-surface-200 md:text-xl">
                  {formatCurrency(totalBudgeted)}
                </p>
              </div>
              <div className="rounded-xl bg-danger-50 p-4 dark:bg-danger-500/10">
                <p className="text-xs font-medium text-danger-600 dark:text-danger-400">Gasto</p>
                <p className="mt-2 text-base font-bold text-danger-700 dark:text-danger-300 md:text-xl">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className={`rounded-xl p-4 ${isOverall ? 'bg-danger-50 dark:bg-danger-500/10' : 'bg-success-50 dark:bg-success-500/10'}`}>
                <p className={`text-xs font-medium ${isOverall ? 'text-danger-600 dark:text-danger-400' : 'text-success-600 dark:text-success-400'}`}>
                  Restante
                </p>
                <p className={`mt-2 text-base font-bold md:text-xl ${isOverall ? 'text-danger-700 dark:text-danger-300' : 'text-success-700 dark:text-success-300'}`}>
                  {isOverall ? '-' : ''}{formatCurrency(Math.abs(totalRemaining))}
                </p>
              </div>
            </div>
          </section>
          </div>
        );
      })()}
        </div>
      )}

      {/* Add budget modal */}
      <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title="Novo Orçamento">
        <form onSubmit={handleSubmitBudget} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="budget-category"
              className="mb-1.5 block text-base font-medium text-surface-700 dark:text-surface-300"
            >
              Categoria
            </label>
            <select
              id="budget-category"
              value={formState.categoryId}
              onChange={(event) => updateFormField('categoryId', event.target.value)}
              className="w-full appearance-none rounded-xl border border-surface-200 bg-white px-4 py-3.5 text-base text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="budget-amount"
              className="mb-1.5 block text-base font-medium text-surface-700 dark:text-surface-300"
            >
              Limite (R$)
            </label>
            <input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={formState.amount}
              onChange={(event) => updateFormField('amount', event.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3.5 text-xl font-semibold text-surface-900 placeholder:text-surface-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              required
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="flex-1 cursor-pointer rounded-xl border border-surface-200 bg-white px-4 py-3 text-base font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-xl bg-primary-500 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={budgetToDelete !== null}
        onClose={() => setBudgetToDelete(null)}
        title="Confirmar exclusão"
      >
        <p className="text-sm text-surface-600 dark:text-surface-400">
          Tem certeza que deseja remover este orçamento?
        </p>
        <div className="mt-4 flex gap-3">
          <button
            id="cancel-delete-budget-button"
            onClick={() => setBudgetToDelete(null)}
            className="flex-1 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
          >
            Cancelar
          </button>
          <button
            id="confirm-delete-budget-button"
            onClick={handleConfirmDelete}
            className="flex-1 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-danger-600"
          >
            Remover
          </button>
        </div>
      </Modal>
    </div>
  );
}
