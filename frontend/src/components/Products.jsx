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
      setCategoriesOptions(
        parsedData.map((categories) => ({
          value: categories.category_number,
          label: categories.category_name,
        }))
      );
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <CustomTable
        data={products}
        title="Products"
        columns={[{ key: 'product_name', label: 'Product Name' }]}
      />
    </div>
  );
}

export default Products;