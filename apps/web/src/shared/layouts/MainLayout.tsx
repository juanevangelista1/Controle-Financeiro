import { Outlet, NavLink, useLocation } from 'react-router';
import { Home, List, BarChart3, Settings, Plus, PiggyBank } from 'lucide-react';

const NAVIGATION_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/transactions', label: 'Transações', icon: List },
  { path: '/reports', label: 'Relatórios', icon: BarChart3 },
  { path: '/budgets', label: 'Orçamentos', icon: PiggyBank },
  { path: '/settings', label: 'Config', icon: Settings },
] as const;

const FAB_INSERT_BEFORE_INDEX = 2;

export function MainLayout() {
  const location = useLocation();
  const isNewTransactionPage = location.pathname === '/transactions/new';

  return (
    <div className="flex min-h-dvh flex-col bg-surface-50 dark:bg-surface-950">
      <main className="flex-1 pb-20">
        <div className="mx-auto max-w-lg px-4 py-4">
          <Outlet />
        </div>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-200 bg-white/80 backdrop-blur-xl dark:border-surface-800 dark:bg-surface-900/80"
        id="bottom-navigation"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isFabPosition = index === FAB_INSERT_BEFORE_INDEX;

            if (isFabPosition) {
              return (
                <div key="fab-group" className="flex items-center gap-1">
                  <NavLink
                    to="/transactions/new"
                    id="fab-new-transaction"
                    className={`-mt-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                      isNewTransactionPage
                        ? 'bg-primary-600 shadow-primary-500/40'
                        : 'bg-primary-500 shadow-primary-500/30 hover:bg-primary-600'
                    }`}
                  >
                    <Plus className="h-6 w-6 text-white" />
                  </NavLink>

                  <NavLink
                    to={item.path}
                    id={`nav-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </NavLink>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`nav-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
