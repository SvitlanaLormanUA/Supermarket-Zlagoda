import React, { useEffect, useState } from 'react';
import api from '../axios'; // Import the configured axios instance
import { validateCategories } from '../utils/Validation';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';
import SortButtons from './SortButtons';
import ProductsModal from './ProductsModal';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const categoryFields = [
    { name: 'category_name', label: 'Category Name' },
  ];
  const [categoryProducts, setCategoryProducts] = useState({});

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isProductsModalOpen, setProductsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const showProductsModal = async (categoryId) => {
    if (!categoryProducts[categoryId]) {
      await toggleCategory(categoryId);
    }
    setSelectedCategoryId(categoryId);
    setProductsModalOpen(true);
  };

  const fetchAllCategories = async () => {
    try {
      const response = await api.get('/categories');
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setCategories(parsedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories.');
    }
  };

  const toggleCategory = async (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (!openCategories[id]) {
      try {
        const response = await api.get(`/products/category/${id}`);
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        setCategoryProducts((prev) => ({
          ...prev,
          [id]: Array.isArray(parsedData) ? parsedData : [],
        }));
      } catch (error) {
        console.error('Error fetching products for category:', error);
        alert('Failed to fetch products for category.');
      }
    }
  };

  const saveNewCategory = async (newCategory) => {
    if (!validateCategories(newCategory)) {
      alert('Invalid category data.');
      return;
    }
    try {
      await api.post('/categories', newCategory);
      await fetchAllCategories();
    } catch (error) {
      console.error('Error adding new category:', error);
      alert(error.response?.data?.detail || 'Error adding new category.');
    }
  };

  const editCategory = async (editedData) => {
    if (!validateCategories(editedData)) {
      alert('Invalid category data.');
      return;
    }
    try {
      await api.patch(`/categories/${editedData.category_number}`, JSON.stringify(editedData));
      await fetchAllCategories();
    } catch (error) {
      console.error('Error editing the category:', error);
      alert(error.response?.data?.detail || 'Error updating category.');
    }
  };

  const deleteCategory = async (category_numbers) => {
    try {
      for (const category_number of category_numbers) {
        const productsResponse = await api.get(`/products/category/${category_number}`);
        const parsedProducts = productsResponse.data.data ?? JSON.parse(productsResponse.data.body).data;

        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          alert(`Cannot delete category #${category_number}, there are products in it.`);
          continue;
        }

        await api.delete(`/categories/${category_number}`);
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.category_number !== category_number)
        );
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error.response?.data?.detail || `Cannot delete category: ${error.message}`);
    }
  };

  const fetchSortedCategories = async () => {
    await fetchAllCategories();
  };

  const handleSort = async (field, order) => {
    if (!field || !order) {
      await fetchSortedCategories();
    } else {
      try {
        const response = await api.get(`/categories/sort/${field}/${order}`);
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        setCategories(parsedData);
      } catch (error) {
        console.error('Error sorting categories:', error);
        alert('Failed to sort categories.');
      }
    }
  };

  return (
    <div className="categories-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <ControlButtons
        onAdd={(data) => saveNewCategory(data)}
        onEdit={(ids) => editCategory(ids)}
        onDelete={(ids) => deleteCategory(ids)}
        modalFields={categoryFields}
        deleteItems={categories}
        itemKey="category_name"
        itemIdKey="category_number"
      />

      <SortButtons
        fields={[
          { key: 'category_name', label: 'Name' },
          { key: 'category_number', label: 'Number' },
        ]}
        onSort={handleSort}
      />

      <AddItemModal
        fields={categoryFields}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveNewCategory}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={editCategory}
        fields={categoryFields}
        items={categories}
        itemKey="category_name"
        itemIdKey="category_number"
      />

      <DeleteItemModal
        items={categories}
        itemKey="category_name"
        itemIdKey="category_number"
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteCategory}
      />

      <ProductsModal
        isOpen={isProductsModalOpen}
        onClose={() => setProductsModalOpen(false)}
        products={categoryProducts[selectedCategoryId] || []}
      />

      <CustomTable
        data={categories}
        title="Categories"
        columns={[{ key: 'category_name', label: 'Categories' }]}
        renderExtraRow={(item) => (
          <button
            className="view-products-button"
            onClick={() => showProductsModal(item.category_number)}
          >Products</button>
        )}
      />
    </div>
  );
}

export default Categories;