import React, { useEffect, useState, useMemo } from 'react';
import api from '../axios';
import { validateProduct } from '../utils/Validation';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';
import SortButtons from './SortButtons';

function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [CategoriesOptions, setCategoriesOptions] = useState([]);

  const productsFields = [
    { name: 'category_number', label: 'Category Number', type: 'fk', options: CategoriesOptions },
    { name: 'product_name', label: 'Name' },
    { name: 'characteristics', label: 'Characteristics' }
  ];

  useEffect(() => {
    fetchAllProducts();
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await api.get('/categories');
      const categoriesData = response.data.data ?? JSON.parse(response.data.body).data;

      const categoriesMap = new Map();
      categoriesData.forEach(category => {
        categoriesMap.set(category.category_number, {
          value: category.category_number,
          label: category.category_name
        });
      });

      const categoriesOptions = Array.from(categoriesMap.values());
      setCategoriesOptions(categoriesOptions);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await api.get('/products');
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setProducts(parsedData);

      const uniqueCategoriesMap = new Map();
      parsedData.forEach(product => {
        if (!uniqueCategoriesMap.has(product.category_number)) {
          uniqueCategoriesMap.set(product.category_number, {
            value: product.category_number,
            label: product.category_name
          });
        }
      });

      const uniqueCategoryOptions = Array.from(uniqueCategoriesMap.values());
      setCategoriesOptions(uniqueCategoryOptions);

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = async (value) => {
    try {
      if (!value) {
        fetchAllProducts();
      } else {
        const response = await api.get(`/products/search/${value}`);
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        setProducts(Array.isArray(parsedData) ? parsedData : [parsedData]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
      alert('No products found.');
    }
  };

  const fetchSortedProducts = async () => {
    await fetchAllProducts();
  };

  const handleSort = async (field, order) => {
    if (!field || !order) {
      await fetchSortedProducts();
    } else {
      try {
        const response = await api.get(`/products/sort/${field}/${order}`);
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        setProducts(parsedData);
      } catch (error) {
        console.error('Error sorting products:', error);
        alert('Failed to sort products.');
      }
    }
  };

  const addProducts = async (newProduct) => {
    if (!validateProduct(newProduct)) {
      return;
    }
    try {
      await api.post('/products/new_product', newProduct);
      await fetchAllProducts();
    } catch (error) {
      console.error('Error adding new product:', error);
      alert(error.response?.data?.detail || 'Error adding new product.');
    }
  };

  const editProducts = async (editedData) => {
    if (!validateProduct(editedData)) {
      return;
    }
    try {
      await api.patch(`/products/${editedData.id_product}`, editedData);
      await fetchAllProducts();
    } catch (error) {
      console.error('Error editing product:', error);
      alert(error.response?.data?.detail || 'Error updating product.');
    }
  };

  const deleteProducts = async (id_product) => {
    try {
      await api.delete(`/products/${id_product}`);
      await fetchAllProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.detail || `Cannot delete product #${id_product}`);
    }
  };


  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack onSearch={handleSearch} />
      </div>

      <ControlButtons
        onAdd={(data) => addProducts(data)}
        onEdit={(ids) => editProducts(ids)}
        onDelete={(ids) => deleteProducts(ids)}
        modalFields={productsFields}
        deleteItems={products}
        itemKey="product_name"
        itemIdKey="id_product"
      />

      <AddItemModal
        fields={productsFields}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addProducts}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={editProducts}
        fields={productsFields}
        items={products}
        itemKey="product_name"
        itemIdKey="id_product"
      />

      <DeleteItemModal
        items={products}
        itemKey="product_name"
        itemIdKey="id_product"
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteProducts}
      />

      <SortButtons
        fields={[
          { key: 'product_name', label: 'Name' },
        ]}
        onSort={handleSort}
      />

      <CustomTable
        data={products}
        title="Products"
        columns={[{ key: 'product_name', label: 'Product Name' }]}
      />
    </div>
  );
}

export default Products;