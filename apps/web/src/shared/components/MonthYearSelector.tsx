import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS } from '@controle-financeiro/shared';
import { useFilterStore } from '@/shared/stores/filterStore';

const APP_START_YEAR = 2026;
const APP_MAX_YEAR_OFFSET = 4;

export function MonthYearSelector() {
	const { selectedMonth, selectedYear, setMonth, setYear } = useFilterStore();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const selectedButtonRef = useRef<HTMLButtonElement>(null);

	const maxYear = APP_START_YEAR + APP_MAX_YEAR_OFFSET;
	const canGoBack = selectedYear > APP_START_YEAR;
	const canGoForward = selectedYear < maxYear;

	useEffect(() => {
		if (selectedButtonRef.current && scrollContainerRef.current) {
			selectedButtonRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center',
			});
		}
	}, [selectedMonth, selectedYear]);

	function handlePreviousYear() {
		if (canGoBack) setYear(selectedYear - 1);
	}

	function handleNextYear() {
		if (canGoForward) setYear(selectedYear + 1);
	}

	return (
		<div className='flex lg:flex-row flex-col items-center justify-between gap-2.5'>
			{/* Year navigation */}
			<div className='flex items-center justify-between rounded-xl border border-surface-200 bg-white px-3 py-2 dark:border-surface-700 dark:bg-surface-800'>
				<button
					id='prev-year-button'
					onClick={handlePreviousYear}
					disabled={!canGoBack}
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-surface-400 dark:hover:bg-surface-700'
					aria-label='Ano anterior'>
					<ChevronLeft className='h-5 w-5' />
				</button>

				<span className='text-base font-semibold text-surface-800 dark:text-surface-200'>
					{selectedYear}
				</span>

				<button
					id='next-year-button'
					onClick={handleNextYear}
					disabled={!canGoForward}
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-surface-400 dark:hover:bg-surface-700'
					aria-label='Próximo ano'>
					<ChevronRight className='h-5 w-5' />
				</button>
			</div>

			{/* Month pills */}
			<div
				ref={scrollContainerRef}
				className='no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5 w-full'>
				{MONTHS.map((month) => {
					const isSelected = month.value === selectedMonth;

					return (
						<button
							key={month.value}
							ref={isSelected ? selectedButtonRef : null}
							id={`month-button-${month.value}`}
							onClick={() => setMonth(month.value)}
							className={
								isSelected
									? 'shrink-0 h-9 w-9 rounded-xl px-5 text-sm font-semibold transition-all bg-primary-500 text-white shadow-sm shadow-primary-500/30'
									: 'shrink-0 h-9 w-9 rounded-xl px-5 text-sm font-medium transition-all bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700'
							}>
							{month.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
