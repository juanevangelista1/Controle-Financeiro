import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS } from '@controle-financeiro/shared';
import { useFilterStore } from '@/shared/stores/filterStore';

const APP_START_YEAR = 2026;
const APP_MAX_YEAR_OFFSET = 4;

export function MonthYearSelector() {
  const { selectedMonth, selectedYear, setMonth, setYear } = useFilterStore();

  const maxYear = APP_START_YEAR + APP_MAX_YEAR_OFFSET;
  const canGoBack = selectedYear > APP_START_YEAR;
  const canGoForward = selectedYear < maxYear;

  function handlePreviousYear() {
    if (canGoBack) setYear(selectedYear - 1);
  }

  function handleNextYear() {
    if (canGoForward) setYear(selectedYear + 1);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Year navigation with arrows */}
      <div className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-2 py-1 dark:border-surface-700 dark:bg-surface-800">
        <button
          id="prev-year-button"
          onClick={handlePreviousYear}
          disabled={!canGoBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-surface-400 dark:hover:bg-surface-700"
          aria-label="Ano anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
          {selectedYear}
        </span>

        <button
          id="next-year-button"
          onClick={handleNextYear}
          disabled={!canGoForward}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-surface-400 dark:hover:bg-surface-700"
          aria-label="Próximo ano"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Month pills — single horizontal scrollable row */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
        {MONTHS.map((month) => {
          const isSelected = month.value === selectedMonth;
          const selectedClass =
            'shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all bg-primary-500 text-white shadow-sm shadow-primary-500/30';
          const defaultClass =
            'shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700';

          return (
            <button
              key={month.value}
              id={`month-button-${month.value}`}
              onClick={() => setMonth(month.value)}
              className={isSelected ? selectedClass : defaultClass}
            >
              {month.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
