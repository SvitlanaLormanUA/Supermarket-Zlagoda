import React, { useEffect, useState } from 'react';

function SortButtons({ onSort, fields = [] }) {
  const [activeField, setActiveField] = useState(null);
  const [order, setOrder] = useState('asc');

  const handleSortClick = (field) => {
    let newOrder = 'asc';
    if (activeField === field && order === 'asc') {
      newOrder = 'desc';
    }
    setActiveField(field);
    setOrder(newOrder);
    onSort(field, newOrder);
  };

  const handleClear = () => {
    setActiveField(null);
    setOrder('asc');
    onSort(null, null);
  };

  const getButtonLabel = (label, field) => {
    if (activeField !== field) return label;
    return `${label} (${order === 'asc' ? '↑' : '↓'})`;
  };

  return (
    <div className="sort-section">
      <span className="sort-label">Sort by:</span>
      {fields.map(({ key, label }) => (
        <button className="sort-button" key={key} onClick={() => handleSortClick(key)}>
          {getButtonLabel(label, key)}
        </button>
      ))}
      <button className="sort-button" onClick={handleClear}>Clear</button>
    </div>
  );
}

export default SortButtons;
