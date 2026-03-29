import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end   = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  const btnBase = `
    flex items-center justify-center rounded-xl font-semibold text-sm
    transition-all duration-200 cursor-pointer select-none
  `;

  return (
    <div className="flex flex-col items-center gap-4 py-4 animate-fade-in">

      {/* Result info */}
      <p className="text-xs text-gray-500">
        Page{' '}
        <span className="font-bold text-[var(--color-forest)]">{page}</span>
        {' '}of{' '}
        <span className="font-bold text-[var(--color-forest)]">{pages}</span>
        {' '}·{' '}
        <span className="font-bold text-gray-700">{total}</span> results
      </p>

      <div className="flex items-center gap-1.5">

        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          title="First page"
          className={`
            ${btnBase} w-9 h-9
            bg-[var(--color-cream-light)] text-gray-500
            border border-[var(--color-rose-beige)]/60
            hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
            hover:border-[var(--color-mint)] hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
          `}
        >
          <FiChevronsLeft size={15} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          title="Previous page"
          className={`
            ${btnBase} w-9 h-9
            bg-[var(--color-cream-light)] text-gray-500
            border border-[var(--color-rose-beige)]/60
            hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
            hover:border-[var(--color-mint)] hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
          `}
        >
          <FiChevronLeft size={15} />
        </button>

        {/* Leading ellipsis */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`
                ${btnBase} w-9 h-9
                bg-[var(--color-cream-light)] text-gray-600
                border border-[var(--color-rose-beige)]/60
                hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
                hover:scale-105
              `}
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                …
              </span>
            )}
          </>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`
              ${btnBase} w-9 h-9
              ${num === page
                ? 'gradient-bg text-white shadow-md shadow-[var(--color-forest)]/30 scale-105 animate-scale-in'
                : `
                  bg-[var(--color-cream-light)] text-gray-700
                  border border-[var(--color-rose-beige)]/60
                  hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
                  hover:border-[var(--color-mint)] hover:scale-105
                `
              }
            `}
          >
            {num}
          </button>
        ))}

        {/* Trailing ellipsis */}
        {getPageNumbers().at(-1) < pages && (
          <>
            {getPageNumbers().at(-1) < pages - 1 && (
              <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                …
              </span>
            )}
            <button
              onClick={() => onPageChange(pages)}
              className={`
                ${btnBase} w-9 h-9
                bg-[var(--color-cream-light)] text-gray-600
                border border-[var(--color-rose-beige)]/60
                hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
                hover:scale-105
              `}
            >
              {pages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          title="Next page"
          className={`
            ${btnBase} w-9 h-9
            bg-[var(--color-cream-light)] text-gray-500
            border border-[var(--color-rose-beige)]/60
            hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
            hover:border-[var(--color-mint)] hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
          `}
        >
          <FiChevronRight size={15} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(pages)}
          disabled={page === pages}
          title="Last page"
          className={`
            ${btnBase} w-9 h-9
            bg-[var(--color-cream-light)] text-gray-500
            border border-[var(--color-rose-beige)]/60
            hover:bg-[var(--color-mint-light)] hover:text-[var(--color-forest)]
            hover:border-[var(--color-mint)] hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
          `}
        >
          <FiChevronsRight size={15} />
        </button>
      </div>

      {/* Mobile quick-jump */}
      <div className="flex items-center gap-2 sm:hidden text-xs text-gray-500">
        <span>Go to page:</span>
        <input
          type="number"
          min={1}
          max={pages}
          defaultValue={page}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= pages) onPageChange(v);
            }
          }}
          className="
            w-14 px-2 py-1 rounded-lg text-center text-xs
            border border-[var(--color-rose-beige)]/70
            bg-[var(--color-cream-light)] text-gray-700
            focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          "
        />
      </div>
    </div>
  );
};

export default Pagination;