import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { seedDefaultCategories } from './domains/categories/repositories/categoryRepository';
import { MainLayout } from './shared/layouts/MainLayout';
import { DashboardPage } from './domains/transactions/components/DashboardPage';
import { TransactionListPage } from './domains/transactions/components/TransactionListPage';
import { TransactionFormPage } from './domains/transactions/components/TransactionFormPage';
import { ReportsPage } from './domains/reports/components/ReportsPage';
import { BudgetsPage } from './domains/budgets/components/BudgetsPage';
import { SettingsPage } from './domains/settings/components/SettingsPage';

function AppInitializer() {
  useEffect(() => {
    seedDefaultCategories();
  }, []);

  return null;
}

export function App() {
  return (
    <>
      <AppInitializer />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionListPage />} />
            <Route path="/transactions/new" element={<TransactionFormPage />} />
            <Route path="/transactions/:id" element={<TransactionFormPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#1E293B',
            color: '#F1F5F9',
            fontSize: '14px',
            padding: '12px 16px',
          },
        }}
      />
    </>
  );
}
