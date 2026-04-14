import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  return (
    <div>
      <p>Page {page} of {pages} ({total} total)</p>
      <div>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          <FiChevronLeft /> Prev
        </button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          let pageNum;
          if (pages <= 7) {
            pageNum = i + 1;
          } else if (page <= 4) {
            pageNum = i + 1;
          } else if (page >= pages - 3) {
            pageNum = pages - 6 + i;
          } else {
            pageNum = page - 3 + i;
          }
          return (
            <button key={pageNum} onClick={() => onPageChange(pageNum)} data-active={pageNum === page}>
              {pageNum}
            </button>
          );
        })}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}>
          Next <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;