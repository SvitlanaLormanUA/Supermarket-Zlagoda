import React, { useEffect, useState } from 'react';
import api from '../axios';
// import { validateUniqueProductInStore, validateProductInStore } from '../utils/Validation';
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
  }, []);

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
  

  const addProducts = async (newStoreProduct) => {
    console.log('add');
    // if (!validateUniqueProductInStore(newStoreProduct, productsInStore) || !validateProductInStore(newStoreProduct)) {
    //   alert('Invalid product data or duplicate product.');
    //   return;
    // }

    // try {
    //   await api.post('/products-in-store/new_product', newStoreProduct);
    //   await fetchAllStoreProducts();
    // } catch (error) {
    //   console.error('Error adding new store product:', error);
    //   alert(error.response?.data?.detail || 'Error adding new store product.');
    // }
  };

  const editProducts = async (editedData) => {
    console.log('edit');
    // if (!validateProductInStore(editedData)) {
    //   alert('Invalid product data.');
    //   return;
    // }

    // try {
    //   await api.patch(`/products-in-store/${editedData.id_product}`, editedData);
    //   await fetchAllStoreProducts();
    // } catch (error) {
    //   console.error('Error editing store product:', error);
    //   alert(error.response?.data?.detail || 'Error updating store product.');
    // }
  };

  const deleteProducts = async (id_product) => {
    console.log('delete');
    // try {
    //   await api.delete(`/products-in-store/${id_product}`);
    //   await fetchAllStoreProducts();
    // } catch (error) {
    //   console.error('Error deleting store product:', error);
    //   alert(error.response?.data?.detail || `Cannot delete store product #${id_product}`);
    // }
  };


  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
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

      <CustomTable
        data={products}
        title="Products"
        columns={[{ key: 'product_name', label: 'Product Name' }]}
      />
    </div>
  );
}

export default Products;