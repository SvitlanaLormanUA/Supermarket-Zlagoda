import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
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

  const editCategory = () => {
    // example
    console.log("Edit category clicked");
  };

  const deleteCategory = () => {
    // example
    console.log("Delete category clicked");
  };

  const saveNewCategory = (newCategory) => {
    console.log("Функція saveNewCategory викликана з даними:", newCategory);

    //ось тут помилка CORS
    fetch('http://127.0.0.1:5174/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories((prev) => [...prev, newCategory]);
      })
      .catch((error) => {
        console.error('Error adding new category:', error);
      });
  };

  return (
    <div className="categories-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <ControlButtons
        onAdd={() => setModalOpen(true)}
        onEdit={editCategory}
        onDelete={deleteCategory}
        modalFields={categoryFields}
      />

      <AddItemModal
        fields={categoryFields}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveNewCategory}
      />

      <CustomTable
        data={categories}
        title="Categories"
        columns={[
          { key: 'category_name', label: 'Categories' },
        ]}
      />
    </div>
  );
}

export default Categories;
