import { useEffect } from "react";
import "styles/_pagination.scss";

function Pagination({ itemsCount, pageSize, currentPage, onPageChange }) {
  const pagesCount = Math.ceil(itemsCount / pageSize);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (pagesCount === 1) return null;

  const generatePageNumbers = () => {
    const pages = [];

    if (pagesCount <= 6) {
      for (let i = 1; i <= pagesCount; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", pagesCount);
      } else if (currentPage === 4) {
        pages.push(1, 2, 3, 4, 5, "...", pagesCount);
      } else if (currentPage > 4 && currentPage < pagesCount - 2) {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          pagesCount
        );
      } else {
        pages.push(
          1,
          "...",
          pagesCount - 3,
          pagesCount - 2,
          pagesCount - 1,
          pagesCount
        );
      }
    }
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <nav className="pagination">
      <ul className="pagination__list">
        <li className="pagination__list-item">
          <button
            className="pagination__btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <i className="bi bi-caret-left-fill"></i>
          </button>
        </li>

        {pages.map((page, index) => (
          <li key={index} className="pagination__list-item">
            {page === "..." ? (
              <span className="pagination__dots">...</span>
            ) : (
              <button
                className={`pagination__btn ${
                  page === currentPage ? "active" : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li className="pagination__list-item">
          <button
            className="pagination__btn"
            disabled={currentPage === pagesCount}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <i className="bi bi-caret-right-fill"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
