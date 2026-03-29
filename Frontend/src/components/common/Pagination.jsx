import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div>
      <p>Showing page {page} of {pages} ({total} results)</p>
      <div>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          <FiChevronLeft />
        </button>
        {getPageNumbers().map((num) => (
          <button key={num} onClick={() => onPageChange(num)} data-active={num === page}>
            {num}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;