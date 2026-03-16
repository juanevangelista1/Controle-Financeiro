import { useState } from 'react';
import { Moon, Sun, Heart, Trash2 } from 'lucide-react';
import { useThemeStore } from '@/shared/stores/themeStore';
import { Modal } from '@/shared/components/Modal';
import { STORAGE_KEYS } from '@/shared/storage/storageKeys';
import { clearFromStorage } from '@/shared/storage/storageService';
import { useTransactionStore } from '@/domains/transactions/stores/transactionStore';
import { useCategoryStore } from '@/domains/categories/stores/categoryStore';
import { useBudgetStore } from '@/domains/budgets/stores/budgetStore';
import { seedDefaultCategories } from '@/domains/categories/repositories/categoryRepository';
import toast from 'react-hot-toast';

const APP_VERSION = '2.0.0';
const APP_STACK = 'React + localStorage';

export function SettingsPage() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);

  const { refreshTransactions } = useTransactionStore();
  const { refreshCategories } = useCategoryStore();
  const { refreshBudgets } = useBudgetStore();

  function handleClearAllData() {
    try {
      clearFromStorage(STORAGE_KEYS.TRANSACTIONS);
      clearFromStorage(STORAGE_KEYS.BUDGETS);
      clearFromStorage(STORAGE_KEYS.CATEGORIES);

      seedDefaultCategories();

      refreshTransactions();
      refreshCategories();
      refreshBudgets();

      setIsClearDataModalOpen(false);
      toast.success('Todos os dados foram removidos.');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast.error('Falha ao limpar os dados.');
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1
          className="text-2xl font-bold text-surface-900 dark:text-white"
          id="settings-title"
        >
          Configurações
        </h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Personalize a sua experiência
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="mb-4 text-sm font-semibold text-surface-700 dark:text-surface-300">
          Aparência
        </h2>

        <button
          id="toggle-dark-mode"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl border border-surface-200 p-4 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:hover:bg-surface-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10">
              {isDarkMode ? (
                <Moon className="h-5 w-5 text-primary-500" />
              ) : (
                <Sun className="h-5 w-5 text-primary-500" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                Modo Escuro
              </p>
              <p className="text-xs text-surface-400">
                {isDarkMode ? 'Ativado' : 'Desativado'}
              </p>
            </div>
          </div>

          <div
            className={`relative h-7 w-12 rounded-full transition-colors ${
              isDarkMode ? 'bg-primary-500' : 'bg-surface-300'
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <h2 className="mb-4 text-sm font-semibold text-surface-700 dark:text-surface-300">
          Sobre
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl border border-surface-200 p-4 dark:border-surface-700">
            <span className="text-sm text-surface-600 dark:text-surface-400">Versão</span>
            <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
              {APP_VERSION}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-surface-200 p-4 dark:border-surface-700">
            <span className="text-sm text-surface-600 dark:text-surface-400">Stack</span>
            <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
              {APP_STACK}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-surface-200 p-4 dark:border-surface-700">
            <span className="text-sm text-surface-600 dark:text-surface-400">Armazenamento</span>
            <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
              Local (offline)
            </span>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-danger-200 bg-white p-5 dark:border-danger-500/30 dark:bg-surface-900">
        <h2 className="mb-4 text-sm font-semibold text-danger-600 dark:text-danger-400">
          Zona de Risco
        </h2>
        <button
          id="clear-all-data-button"
          onClick={() => setIsClearDataModalOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-danger-200 p-4 text-left transition-colors hover:bg-danger-50 dark:border-danger-500/30 dark:hover:bg-danger-500/10"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 dark:bg-danger-500/10">
            <Trash2 className="h-5 w-5 text-danger-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-danger-700 dark:text-danger-400">
              Limpar Todos os Dados
            </p>
            <p className="text-xs text-surface-400">
              Remove todas as transações e orçamentos
            </p>
          </div>
        </button>
      </section>

      <p className="flex items-center justify-center gap-1 text-xs text-surface-400">
        Feito com <Heart className="h-3 w-3 text-danger-500" /> para controlar suas finanças
      </p>

      {/* Clear data confirmation modal */}
      <Modal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        title="Limpar todos os dados"
      >
        <p className="text-sm text-surface-600 dark:text-surface-400">
          Esta ação removerá permanentemente todas as suas transações e orçamentos. As categorias padrão serão restauradas. Esta ação não pode ser desfeita.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setIsClearDataModalOpen(false)}
            className="flex-1 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
          >
            Cancelar
          </button>
          <button
            id="confirm-clear-data-button"
            onClick={handleClearAllData}
            className="flex-1 rounded-xl bg-danger-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-danger-600"
          >
            Limpar tudo
          </button>
        </div>
      </Modal>
    </div>
  );
}
