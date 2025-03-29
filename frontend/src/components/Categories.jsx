import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const categoryFields = [
    { name: "category_name", label: "Name" },
    // not all fields(just example)
  ];
  const [categoryProducts, setCategoryProducts] = useState({});

  useEffect(() => {
    fetch('http://127.0.0.1:5174/categories')
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body).data;
        setCategories(parsedData);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (!openCategories[id]) {
      fetch(`http://127.0.0.1:5174/products/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const parsedData = JSON.parse(data.body).data;
          setCategoryProducts((prev) => ({
            ...prev,
            [id]: Array.isArray(parsedData) ? parsedData : [],
          }));
        })
        .catch((error) => {
          console.error('Error fetching products for category:', error);
        });
    }
  };

  const addCategory = (data) => {
    // example
    console.log("Add category clicked");
  };

  const editCategory = () => {
    // example
    console.log("Edit category clicked");
  };

  const deleteCategory = () => {
    // example
    console.log("Delete category clicked");
  };

  return (
    <div className="categories-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <ControlButtons
        onAdd={addCategory}
        onEdit={editCategory}
        onDelete={deleteCategory}
        modalFields={categoryFields}
      />

      <table className="categories-table">
        <thead>
          <tr>
            <th colSpan="2">Categories</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((category) => (
              <React.Fragment key={category.category_number}>
                <tr className="category-row-header" onClick={() => toggleCategory(category.category_number)}>
                  <td>{category.category_name}</td>
                  <td style={{ textAlign: 'right' }}>
                    {category.category_number}
                    <span className="list-arrow" style={{ marginLeft: '10px' }}>
                      {openCategories[category.category_number] ? '▲' : '▼'}
                    </span>
                  </td>
                </tr>
                {openCategories[category.category_number] && (
                  <tr>
                    <td colSpan="3" className="category-products">
                      {Array.isArray(categoryProducts[category.category_number]) &&
                        categoryProducts[category.category_number].length > 0 ? (
                        categoryProducts[category.category_number].map((product) => (
                          <div key={product.id_product} className="product-item">
                            <p>{product.product_name}</p>
                          </div>
                        ))
                      ) : (
                        <p>No products found in this category.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr><td colSpan="3">No categories found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
