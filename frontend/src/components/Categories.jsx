import React from 'react';
import SearchAndBack from './SearchAndBack';

function Categories() {
  return (
    <div className="categories-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>
      <div className="action-buttons">
        <button className="action-button add-button">Add</button>
        <button className="action-button edit-button ">Edit</button>
        <button className="action-button delete-button ">Delete</button>
      </div>
    </div>
  );
}

export default Categories;
