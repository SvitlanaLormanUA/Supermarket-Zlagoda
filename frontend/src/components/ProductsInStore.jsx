import React, { useEffect, useState } from 'react';
import api from '../axios';
import { validateUniqueField, validateProductInStore } from '../utils/Validation';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';
import SortButtons from './SortButtons';

function ProductsInStore() {
  const [productsInStore, setProductsInStore] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filterDiscounted, setFilterDiscounted] = useState(false);
  const [filterNonDiscounted, setFilterNonDiscounted] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [UPCOptions, setUPCOptions] = useState([]);

  const productsInStoreFields = [
    { name: 'UPC', label: 'UPC', readOnly: true },
    { name: 'UPC_prom', label: 'UPC_prom', type: 'fk', options: UPCOptions },
    { name: 'id_product', label: 'Product ID', type: 'fk', options: productOptions, readOnly: true },
    { name: 'selling_price', label: 'Price' },
    { name: 'products_number', label: 'Products Number' },
    { name: 'promotional_product', label: 'Promotional Product', type: 'boolean' },
  ];

  useEffect(() => {
    fetchAllStoreProducts();
  }, []);

  const fetchAllStoreProducts = async () => {
    try {
      const response = await api.get('/products-in-store');
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setProductsInStore(parsedData);
      setUPCOptions(
        parsedData.map((product) => ({
          value: product.UPC,
          label: product.product_name,
        }))
      );
    } catch (error) {
      console.error('Error fetching store products:', error);
      setProductsInStore([]);
      alert('Failed to fetch store products.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/product-by-ID');
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        const productIdOptions = parsedData.map((product) => ({
          value: product.id_product,
          label: product.product_name,
        }));
        setProductOptions(productIdOptions);
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async (value) => {
    try {
      if (!value || value.trim() === '') {
        await fetchAllStoreProducts();
        return;
      }

      const response = await api.get(`/products-in-store/search/${encodeURIComponent(value)}`);
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setProductsInStore(Array.isArray(parsedData) ? parsedData : [parsedData]);
    } catch (error) {
      console.error('Error searching products:', error);
      if (error.response?.status === 401) {
        alert('Please log in to search products.');
        // Optionally redirect to login page
        // window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('You do not have permission to search products.');
      } else {
        alert(error.response?.data?.body?.message || 'No products found.');
      }
      setProductsInStore([]);
    }
  };

  const addProductsInStore = async (newStoreProduct) => {
    const validatedProduct = validateProductInStore(newStoreProduct);

    if (
      !validatedProduct ||
      !validateUniqueField(validatedProduct, productsInStore, 'UPC') ||
      !validateUniqueField(newStoreProduct, productsInStore, 'id_product')
    ) {
      return;
    }

    try {
      await api.post('/products-in-store/new_product', validatedProduct);
      await fetchAllStoreProducts();
    } catch (error) {
      console.error('Error adding new store product:', error);
      alert(error.response?.data?.detail || 'Error adding new store product.');
    }
  };

  const editProductsInStore = async (editedData) => {
    const validatedProduct = validateProductInStore(editedData);
    if (!validatedProduct) {
      alert('Invalid product data.');
      return;
    }

    try {
      await api.patch(`/products-in-store/${editedData.id_product}`, editedData);
      await fetchAllStoreProducts();
    } catch (error) {
      console.error('Error editing store product:', error);
      alert(error.response?.data?.detail || 'Error updating store product.');
    }
  };

  const deleteProductsInStore = async (id_product) => {
    try {
      await api.delete(`/products-in-store/${id_product}`);
      await fetchAllStoreProducts();
    } catch (error) {
      console.error('Error deleting store product:', error);
      alert(error.response?.data?.detail || `Cannot delete store product #${id_product}`);
    }
  };

  const fetchFilteredProducts = async (onlyDiscounted, onlyNonDiscounted) => {
    try {
      let url = '/products-in-store';
      if (onlyDiscounted) {
        url += '?discount=true';
      } else if (onlyNonDiscounted) {
        url += '?discount=false';
      }
      const response = await api.get(url);
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setProductsInStore(parsedData);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      alert('Failed to fetch filtered products.');
    }
  };

  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack onSearch={handleSearch} />
      </div>

      <ControlButtons
        onAdd={(data) => addProductsInStore(data)}
        onEdit={(ids) => editProductsInStore(ids)}
        onDelete={(ids) => deleteProductsInStore(ids)}
        modalFields={productsInStoreFields}
        deleteItems={productsInStore}
        itemKey="product_name"
        itemIdKey="id_product"
      />

      <SortButtons
        fields={[
          { key: 'product_name', label: 'Name' },
          { key: 'products_number', label: 'Quantity' },
        ]}
        onSort={(field, order) => {
          if (!field || !order) {
            fetchFilteredProducts(filterDiscounted, filterNonDiscounted);
          } else {
            let url = `/products-in-store/sort/${field}/${order}`;
            if (filterDiscounted) url += '?discount=true';
            else if (filterNonDiscounted) url += '?discount=false';

            api
              .get(url)
              .then((response) => {
                const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
                setProductsInStore(parsedData);
              })
              .catch((error) => {
                console.error('Error sorting products:', error);
                alert('Failed to sort products.');
              });
          }
        }}
      />

      <div className="filter-section">
        <span className="filter-label">Filter:</span>
        <label>
          <input
            type="checkbox"
            checked={filterDiscounted}
            onChange={() => {
              const newValue = !filterDiscounted;
              setFilterDiscounted(newValue);
              setFilterNonDiscounted(false);
              fetchFilteredProducts(newValue, false);
            }}
          />
          Only Promotional Products
        </label>
        <label>
          <input
            type="checkbox"
            checked={filterNonDiscounted}
            onChange={() => {
              const newValue = !filterNonDiscounted;
              setFilterNonDiscounted(newValue);
              setFilterDiscounted(false);
              fetchFilteredProducts(false, newValue);
            }}
          />
          Non Promotional Products
        </label>
      </div>

      <AddItemModal
        fields={productsInStoreFields}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addProductsInStore}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={editProductsInStore}
        fields={productsInStoreFields}
        items={productsInStore}
        itemKey="product_name"
        itemIdKey="id_product"
      />

      <DeleteItemModal
        items={productsInStore}
        itemKey="product_name"
        itemIdKey="id_product"
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteProductsInStore}
      />

      <CustomTable
        data={productsInStore}
        title="Products In Store"
        columns={[{ key: 'product_name', label: 'Product Name' }]}
      />
    </div>
  );
}

export default ProductsInStore;