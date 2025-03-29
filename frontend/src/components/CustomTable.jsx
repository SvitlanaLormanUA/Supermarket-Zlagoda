import React, { useState } from 'react';

function CustomTable({ data, title, columns }) {
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th colSpan={columns.length}>{title}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <tr className="table-row-header" onClick={() => toggleRow(index)} style={{ cursor: 'pointer' }}>
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
                      <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {value || '—'}</p>
                    ))}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default CustomTable;
