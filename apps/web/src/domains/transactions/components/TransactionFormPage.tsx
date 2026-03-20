import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, TrendingDown, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import {
	useTransactionById,
	useAddTransaction,
	useEditTransaction,
} from '../hooks/useTransactions';
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

const INPUT_CLASS =
	'w-full rounded-xl border border-surface-200 bg-white px-4 py-3.5 text-base text-surface-900 placeholder:text-surface-300 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-white dark:placeholder:text-surface-600';

const LABEL_CLASS = 'mb-1.5 block text-base font-medium text-surface-700 dark:text-surface-300';

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

	const categoriesForCurrentType = categories.filter((category) => category.type === formState.type);

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
				toast.success('Transação atualizada!');
				navigate('/transactions');
			} else {
				addTransaction(transactionData);
				toast.success('Transação adicionada!');
				navigate('/');
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (isEditMode && transactionId && !existingTransaction) {
		return (
			<div className='flex flex-col items-center gap-4 py-12 text-center animate-fade-in'>
				<p className='text-surface-500 dark:text-surface-400'>Transação não encontrada.</p>
				<button
					onClick={() => navigate('/transactions')}
					className='text-sm font-medium text-primary-500 hover:text-primary-600'>
					Voltar para transações
				</button>
			</div>
		);
	}

	const isExpense = formState.type === TRANSACTION_TYPES.EXPENSE;
	const isIncome = formState.type === TRANSACTION_TYPES.INCOME;

	return (
		<div className='flex flex-col gap-6 animate-fade-in max-w-2xl mx-auto w-full'>
			{/* Header */}
			<div className='flex items-center gap-3'>
				<button
					id='back-button'
					onClick={() => navigate(-1)}
					className='flex h-11 w-11 items-center justify-center rounded-xl border border-surface-200 text-surface-600 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-400 dark:hover:bg-surface-800'
					aria-label='Voltar'>
					<ArrowLeft className='h-6 w-6' />
				</button>
				<h1 className='text-2xl md:text-3xl font-bold text-surface-900 dark:text-white'>
					{isEditMode ? 'Editar Transação' : 'Nova Transação'}
				</h1>
			</div>

			{/* Type toggle */}
			<div className='flex rounded-xl bg-surface-100 p-1 dark:bg-surface-800'>
				<button
					id='type-expense-button'
					type='button'
					onClick={() => handleTypeChange('EXPENSE')}
					className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-base font-medium transition-all ${
						isExpense
							? 'bg-danger-500 text-white shadow-md shadow-danger-500/25'
							: 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
					}`}>
					<TrendingDown className='h-5 w-5' />
					Despesa
				</button>
				<button
					id='type-income-button'
					type='button'
					onClick={() => handleTypeChange('INCOME')}
					className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-base font-medium transition-all ${
						isIncome
							? 'bg-success-500 text-white shadow-md shadow-success-500/25'
							: 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
					}`}>
					<TrendingUp className='h-5 w-5' />
					Receita
				</button>
			</div>

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-5'>
				{/* Amount */}
				<div>
					<label
						htmlFor='transaction-amount'
						className={LABEL_CLASS}>
						Valor (R$)
					</label>
					<input
						id='transaction-amount'
						type='number'
						step='0.01'
						min='0'
						placeholder='0,00'
						value={formState.amount}
						onChange={(event) => updateFormField('amount', event.target.value)}
						className={`${INPUT_CLASS} text-xl md:text-2xl font-semibold h-14`}
						required
					/>
				</div>

				{/* Date */}
				<div>
					<label
						htmlFor='transaction-date'
						className={LABEL_CLASS}>
						Data
					</label>
					<input
						id='transaction-date'
						type='date'
						value={formState.date}
						onChange={(event) => updateFormField('date', event.target.value)}
						className={INPUT_CLASS}
						required
					/>
				</div>

				{/* Category */}
				<div>
					<label
						htmlFor='transaction-category'
						className={LABEL_CLASS}>
						Categoria
					</label>
					<select
						id='transaction-category'
						value={formState.categoryId}
						onChange={(event) => updateFormField('categoryId', event.target.value)}
						className={`${INPUT_CLASS} appearance-none`}
						required>
						<option value=''>Selecione uma categoria</option>
						{categoriesForCurrentType.map((category) => (
							<option
								key={category.id}
								value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor='transaction-description'
						className={LABEL_CLASS}>
						Descrição <span className='text-sm font-normal text-surface-400'>(opcional)</span>
					</label>
					<textarea
						id='transaction-description'
						placeholder='Ex: Almoço no restaurante X'
						value={formState.description}
						onChange={(event) => updateFormField('description', event.target.value)}
						maxLength={255}
						rows={3}
						className={`${INPUT_CLASS} resize-none`}
					/>
				</div>

				{/* Submit */}
				<button
					id='submit-transaction'
					type='submit'
					disabled={isSubmitting}
					className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 mt-2 ${
						isExpense
							? 'bg-danger-500 shadow-danger-500/25 hover:bg-danger-600'
							: 'bg-success-500 shadow-success-500/25 hover:bg-success-600'
					}`}>
					<Save className='h-5 w-5' />
					{getSubmitButtonLabel()}
				</button>
			</form>
		</div>
	);
}
