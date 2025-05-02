import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

function CustomTable({ data, title, columns, rowsPerPage = 6, renderExtraRow }) {
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

  useEffect(() => {
    if (currentPageData.length === 0 && currentPage > 1) {
      setOpenRow(null);
      setCurrentPage(currentPage - 1);
    }
    if (data.length === 0 && currentPage !== 1) {
      setOpenRow(null);
      setCurrentPage(1);
    }
    if (currentPage > totalPages && totalPages > 0) {
      setOpenRow(null);
      setCurrentPage(totalPages);
    }
  }, [data, currentPage, currentPageData.length, totalPages]);

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
              <tr className="table-row-header" onClick={() => toggleRow(index)}>
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
                      {renderExtraRow && renderExtraRow(item)}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {currentPageData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}

export default CustomTable;