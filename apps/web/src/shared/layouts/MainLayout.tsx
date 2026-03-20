import { Outlet, NavLink, useLocation } from 'react-router';
import { Home, List, BarChart3, Plus, PiggyBank } from 'lucide-react';

const NAVIGATION_ITEMS = [
	{ path: '/', label: 'Home', icon: Home },
	{ path: '/transactions', label: 'Transações', icon: List },
	{ path: '/reports', label: 'Relatórios', icon: BarChart3 },
	{ path: '/budgets', label: 'Orçamentos', icon: PiggyBank },
] as const;

const FAB_INSERT_BEFORE_INDEX = 1;

export function MainLayout() {
	const location = useLocation();
	const isNewTransactionPage = location.pathname === '/transactions/new';

	return (
		<div className='flex min-h-dvh  flex-col bg-surface-50 dark:bg-surface-950 mt-15 mb-5'>
			{/* Top Navigation for Desktop */}
			<nav className=' mt-5 mb-5 hidden md:flex sticky top-0 left-0 right-0 z-40 w-full border-b border-surface-200/60 bg-white/95 backdrop-blur-xl dark:border-surface-800/60 dark:bg-surface-900/95 shadow-sm h-15'>
				<div className='mx-auto grid max-w-5xl grid-cols-3 items-center  p-8 '>
					{/* Brand */}
					<div className='flex items-center gap-5'>
						<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 shadow-sm shadow-primary-500/30'>
							<span className='text-xs font-bold text-white tracking-tight'>CF</span>
						</div>
						<span className='hidden lg:block text-sm font-semibold tracking-tight text-surface-700 dark:text-surface-300'>
							Controle Financeiro
						</span>
					</div>

					{/* Centered nav items */}
					<div className='flex items-center justify-center gap-5'>
						{NAVIGATION_ITEMS.map((item) => (
							<DesktopNavItem
								key={item.path}
								item={item}
							/>
						))}
					</div>

					{/* CTA button */}
					<div className='flex justify-end'>
						<NavLink
							to='/transactions/new'
							className={`flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-md transition-all active:scale-95 ${
								isNewTransactionPage
									? 'bg-primary-600 shadow-primary-500/40'
									: 'bg-primary-500 shadow-primary-500/25 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-lg'
							}`}>
							<Plus className='h-4 w-4' />
							Nova Transação
						</NavLink>
					</div>
				</div>
			</nav>

			<main className='m-auto w-full max-w-5xl flex-1 px-4 py-6 pb-28 md:py-10 md:mt-[30px]'>
				<Outlet />
			</main>

			{/* Bottom Navigation for Mobile */}
			<nav
				className='md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-surface-200/80 bg-white/95 backdrop-blur-xl dark:border-surface-800/80 dark:bg-surface-900/95'
				id='bottom-navigation'>
				<div className='mx-auto flex max-w-lg items-center justify-around px-2 pb-safe pt-1'>
					{NAVIGATION_ITEMS.map((item, index) => {
						const isFabPosition = index === FAB_INSERT_BEFORE_INDEX;

						if (isFabPosition) {
							return (
								<>
									<NavItem
										key={item.path}
										item={item}
									/>
									<div
										key='fab-group'
										className='flex items-center'>
										<NavLink
											to='/transactions/new'
											id='fab-new-transaction'
											className={`-mt-8 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-xl transition-all active:scale-95 ${
												isNewTransactionPage
													? 'bg-primary-600 shadow-primary-500/50'
													: 'bg-primary-500 shadow-primary-500/30 hover:bg-primary-600'
											}`}>
											<Plus
												className={`h-7 w-7 text-white transition-transform duration-200 ${
													isNewTransactionPage ? 'rotate-45' : ''
												}`}
											/>
										</NavLink>
									</div>
								</>
							);
						}

						return (
							<NavItem
								key={item.path}
								item={item}
							/>
						);
					})}
				</div>
			</nav>
		</div>
	);
}

interface NavItemProps {
	item: { path: string; label: string; icon: React.ElementType };
}

function NavItem({ item }: NavItemProps) {
	const Icon = item.icon;
	return (
		<NavLink
			to={item.path}
			end={item.path === '/'}
			id={`nav-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
			className={({ isActive }) =>
				`relative flex cursor-pointer flex-col items-center gap-1 rounded-xl px-4 py-2.5 transition-colors ${
					isActive
						? 'text-primary-600 dark:text-primary-400'
						: 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300'
				}`
			}>
			{({ isActive }) => (
				<>
					{isActive && (
						<span className='absolute -top-0.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-primary-500' />
					)}
					<Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
					<span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
						{item.label}
					</span>
				</>
			)}
		</NavLink>
	);
}

function DesktopNavItem({ item }: NavItemProps) {
	const Icon = item.icon;
	return (
		<NavLink
			to={item.path}
			end={item.path === '/'}
			id={`desktop-nav-${item.label.toLowerCase().replace(/[^a-z]/g, '')}`}
			className={({ isActive }) =>
				`relative flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium tracking-tight transition-all ${
					isActive
						? 'bg-primary-50 font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
						: 'text-surface-500 hover:bg-surface-100 hover:text-surface-800 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200'
				}`
			}>
			{({ isActive }) => (
				<>
					<Icon className={`h-4 w-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
					{item.label}
					{isActive && (
						<span className='absolute -bottom-px left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary-500' />
					)}
				</>
			)}
		</NavLink>
	);
}
