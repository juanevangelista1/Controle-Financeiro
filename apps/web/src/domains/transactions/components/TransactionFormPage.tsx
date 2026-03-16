import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTransactionById, useAddTransaction, useEditTransaction } from '../hooks/useTransactions';
import { useCategories } from '@/domains/categories/hooks/useCategories';
import { getCurrentDateString } from '@/shared/utils/formatters';
import { createTransactionSchema, TRANSACTION_TYPES } from '@controle-financeiro/shared';

type TransactionFormType = 'INCOME' | 'EXPENSE';

interface FormState {
  amount: string;
  type: TransactionFormType;
  description: string;
  date: string;
  categoryId: string;
}

const INITIAL_FORM_STATE: FormState = {
  amount: '',
  type: 'EXPENSE',
  description: '',
  date: getCurrentDateString(),
  categoryId: '',
};

export function TransactionFormPage() {
  const navigate = useNavigate();
  const { id: transactionId } = useParams<{ id: string }>();
  const isEditMode = Boolean(transactionId);

  const existingTransaction = useTransactionById(transactionId ?? '');
  const { categories } = useCategories();
  const addTransaction = useAddTransaction();
  const editTransaction = useEditTransaction();

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && existingTransaction) {
      setFormState({
        amount: String(existingTransaction.amount),
        type: existingTransaction.type as TransactionFormType,
        description: existingTransaction.description ?? '',
        date: existingTransaction.date,
        categoryId: existingTransaction.categoryId,
      });
    }
  }, [isEditMode, existingTransaction]);

  const categoriesForCurrentType = categories.filter(
    (category) => category.type === formState.type,
  );

  function updateFormField(field: keyof FormState, value: string) {
    setFormState((previousState) => ({ ...previousState, [field]: value }));
  }

  function handleTypeChange(type: TransactionFormType) {
    setFormState((previousState) => ({ ...previousState, type, categoryId: '' }));
  }

  function getSubmitButtonLabel() {
    if (isSubmitting) return 'Salvando...';
    if (isEditMode) return 'Atualizar';
    return 'Salvar';
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAmount = parseFloat(formState.amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Insira um valor válido');
      return;
    }

    const validationResult = createTransactionSchema.safeParse({
      amount: parsedAmount,
      type: formState.type,
      description: formState.description || null,
      date: formState.date,
      categoryId: formState.categoryId,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message);
      return;
    }

    const transactionData = {
      ...validationResult.data,
      description: validationResult.data.description ?? null,
    };

    setIsSubmitting(true);

    try {
      if (isEditMode && transactionId) {
        editTransaction(transactionId, transactionData);
        navigate('/transactions');
      } else {
        addTransaction(transactionData);
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEditMode && transactionId && !existingTransaction) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center animate-fade-in">
        <p className="text-surface-500 dark:text-surface-400">
          Transação não encontrada.
        </p>
        <button
          onClick={() => navigate('/transactions')}
          className="text-sm font-medium text-primary-500 hover:text-primary-600"
        >
          Voltar para transações
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          id="back-button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-surface-500 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {isEditMode ? 'Editar Transação' : 'Nova Transação'}
        </h1>
      </div>

      <div className="flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800">
        <button
          id="type-expense-button"
          onClick={() => handleTypeChange('EXPENSE')}
          className={
            formState.type === TRANSACTION_TYPES.EXPENSE
              ? 'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all bg-danger-500 text-white shadow-md'
              : 'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all text-surface-500 hover:text-surface-700 dark:text-surface-400'
          }
        >
          Despesa
        </button>
        <button
          id="type-income-button"
          onClick={() => handleTypeChange('INCOME')}
          className={
            formState.type === TRANSACTION_TYPES.INCOME
              ? 'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all bg-success-500 text-white shadow-md'
              : 'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all text-surface-500 hover:text-surface-700 dark:text-surface-400'
          }
        >
          Receita
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="transaction-amount"
            className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Valor (R$)
          </label>
          <input
            id="transaction-amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={formState.amount}
            onChange={(event) => updateFormField('amount', event.target.value)}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-lg font-semibold text-surface-900 placeholder:text-surface-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="transaction-date"
            className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Data
          </label>
          <input
            id="transaction-date"
            type="date"
            value={formState.date}
            onChange={(event) => updateFormField('date', event.target.value)}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="transaction-category"
            className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Categoria
          </label>
          <select
            id="transaction-category"
            value={formState.categoryId}
            onChange={(event) => updateFormField('categoryId', event.target.value)}
            className="w-full appearance-none rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categoriesForCurrentType.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="transaction-description"
            className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            Descrição{' '}
            <span className="font-normal text-surface-400">(opcional)</span>
          </label>
          <textarea
            id="transaction-description"
            placeholder="Ex: Almoço no restaurante X"
            value={formState.description}
            onChange={(event) => updateFormField('description', event.target.value)}
            maxLength={255}
            rows={3}
            className="w-full resize-none rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
          />
        </div>

        <button
          id="submit-transaction"
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {getSubmitButtonLabel()}
        </button>
      </form>
    </div>
  );
}
