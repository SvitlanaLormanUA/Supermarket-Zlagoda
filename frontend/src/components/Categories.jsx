import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import DeleteItemModal from "./DeleteItemModal";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const categoryFields = [
    { name: "category_name", label: "Category Name" },
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

  const saveNewCategory = (newCategory) => {

    return fetch('http://127.0.0.1:5174/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || 'Error with request');
          });
        }
        return response.json();
      })
      .then(() => {
        return fetch('http://127.0.0.1:5174/categories')
          .then((res) => res.json())
          .then((data) => {
            const parsedData = JSON.parse(data.body).data;
            setCategories(parsedData);
          })
          .catch((error) => {
            console.error('Error fetching categories:', error);
          });
      })
      .catch((error) => {
        console.error('Error adding new category:', error);
      });
  };


  const editCategory = () => {
    // example
    console.log("Edit category clicked");
  };


  const deleteCategory = async (category_numbers) => {
    try {
      for (const category_number of category_numbers) {
        const productsResponse = await fetch(`http://127.0.0.1:5174/products/category/${category_number}`);
        const productsData = await productsResponse.json();
        const parsedProducts = JSON.parse(productsData.body).data;

        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          alert(`Cannot delete category #${category_number}, there are products in it.`);
          continue;
        }

        const response = await fetch(`http://127.0.0.1:5174/categories/${category_number}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.data || `Cannot delete category #${category_number}`);
        }

        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.category_number !== category_number)
        );
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.message);
    }
  };

  return (
    <div className="categories-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <ControlButtons
        onAdd={(data) => saveNewCategory(data)}
        onEdit={editCategory}
        onDelete={(ids) => deleteCategory(ids)}
        modalFields={categoryFields}
        deleteItems={categories}
        itemKey="category_name"
        itemIdKey="category_number"
      />

      <AddItemModal
        fields={categoryFields}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveNewCategory}
      />

      <DeleteItemModal
        items={categories}
        itemKey="category_name"
        itemIdKey="category_number"
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteCategory}
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
