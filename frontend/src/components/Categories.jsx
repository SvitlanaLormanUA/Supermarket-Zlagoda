import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import AddItemModal from './AddItemModal';

function Categories() {

  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fields, setFields] = useState([
    { name: 'category_name', label: 'Category Name' },
    { name: 'category_number', label: 'Category ID' }
  ]);

  useEffect(() => {
    fetch('http://127.0.0.1:5174/categories')
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body).data;
        setCategories(parsedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
  };

  const saveNewCategory = (newCategory) => {
    console.log('Saving new category:', newCategory);
    //add then a database saving
    closeAddModal();
  };


  return (
    <div className="categories-container">

      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>
      <div className="action-buttons">
        <button className="action-button add-button" onClick={openAddModal}>Add</button>
        <button className="action-button edit-button ">Edit</button>
        <button className="action-button delete-button ">Delete</button>
      </div>

      <div className="categories-table">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.category_number} className="category-row">
              <div className="category-row-header" onClick={() => toggleCategory(category.category_number)}>
                <div className="category-name">{category.category_name}</div>
                <div className="category-right">
                  <span className="category-id">ID: {category.category_number}</span>
                  <span className="category-arrow">
                    {openCategories[category.category_number] ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {openCategories[category.category_number] && (
                <div className="category-products">
                  <p>Products of this category will appear here...</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No categories found.</p>
        )}
      </div>

      <AddItemModal
        fields={fields}
        isOpen={isModalOpen}
        onClose={closeAddModal}
        onSave={saveNewCategory}
      />
    </div>
  );
}

export default Categories;
