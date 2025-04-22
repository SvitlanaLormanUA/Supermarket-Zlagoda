import React, { useState } from 'react';

function CustomTable({ data, title, columns, rowsPerPage = 6 }) {
  const [openRow, setOpenRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPageData = data.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page) => {
    setOpenRow(null);
    setCurrentPage(page);
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th colSpan={columns.length}>{title}</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item, index) => (
            <React.Fragment key={startIndex + index}>
              <tr
                className="table-row-header"
                onClick={() => toggleRow(index)}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    <span className="table-content">{item[col.key]}</span>
                    {colIndex === columns.length - 1 && (
                      <span className="list-arrow">
                        {openRow === index ? '▲' : '▼'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              {openRow === index && (
                <tr className="table-details-row">
                  <td colSpan={columns.length}>
                    <div className="table-details">
                      {Object.entries(item).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key.replace(/_/g, ' ')}:</strong> {value || '—'}
                        </p>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button className="prev" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              className={currentPage === idx + 1 ? 'active' : ''}
            >
              {idx + 1}
            </button>
          ))}
          <button className="next" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomTable;
