import React, { useEffect, useState } from 'react';
import { validateUniqueProductInStore, validateProductInStore } from '../utils/Validation';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import EditItemModal from "./EditItemModal";
import DeleteItemModal from "./DeleteItemModal";
import SortButtons from './SortButtons';

function ProductsInStore() {
  const [productsInStore, setProductsInStore] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [productOptions, setProductOptions] = useState([]);
  const [UPCOptions, setUPCOptions] = useState([]);

  const productsInStoreFields = [
    { name: "UPC", label: "UPC", readOnly: true },
    { name: "UPC_prom", label: "UPC_prom", type: "fk", options: UPCOptions },
    { name: "id_product", label: "Product ID", type: "fk", options: productOptions, readOnly: true },
    { name: "selling_price", label: "Price" },
    { name: "products_number", label: "Products Number" },
    { name: "promotional_product", label: "Promotional Product", type: "boolean" }
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:5174/products-in-store')
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body).data;
        setProductsInStore(parsedData);
        setUPCOptions(parsedData.map((product) => ({
          value: product.UPC,
          label: product.product_name
        })));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5174/product-by-ID')
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body).data;
        const productIdOptions = parsedData.map((product) => ({
          value: product.id_product,
          label: product.product_name
        }));
        setProductOptions(productIdOptions);
      })
      .catch((error) => {
        console.error('Error fetching all products:', error);
      });
  }, []);


  const handleSearch = (value) => {
    if (!value) {
      fetch('http://127.0.0.1:5174/products-in-store')
        .then((res) => res.json())
        .then((data) => {
          const parsedData = JSON.parse(data.body).data;
          setProductsInStore(parsedData);
        });
    } else {
      fetch(`http://127.0.0.1:5174/products-in-store/search/${value}`)
        .then((res) => res.json())
        .then((data) => {
          const parsedData = JSON.parse(data.body).data;
          if (Array.isArray(parsedData)) {
            setProductsInStore(parsedData);
          } else {
            setProductsInStore([parsedData]);
          }
        })
        .catch(() => {
          setProductsInStore([]);
        });
    }
  };

  const addProductsInStore = (newStoreProduct) => {
    if ((!validateUniqueProductInStore(newStoreProduct, productsInStore)) || (!validateProductInStore(newStoreProduct))) {
      return;
    }

    return fetch('http://127.0.0.1:5174/products-in-store/new_product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStoreProduct),
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
        return fetch('http://127.0.0.1:5174/products-in-store')
          .then((res) => res.json())
          .then((data) => {
            const parsedData = JSON.parse(data.body).data;
            setProductsInStore(parsedData);
          })
          .catch((error) => {
            console.error('Error fetching categories:', error);
          });
      })
      .catch((error) => {
        console.error('Error adding new category:', error);
      });
  };


  const editProductsInStore = async (editedData) => {
    if (!validateProductInStore(editedData)) {
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5174/products-in-store/${editedData.id_product}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error updating store product');
      }

      const updatedResponse = await fetch('http://127.0.0.1:5174/products-in-store');
      const updatedData = await updatedResponse.json();

      const parsedData = updatedData.data || JSON.parse(updatedData.body).data;
      setProductsInStore(parsedData);
    } catch (error) {
      console.error('Error editing the category:', error);
      alert(error.message);
    }
  };

  const deleteProductsInStore = async (id_product) => {
    try {
      const response = await fetch(`http://127.0.0.1:5174/products-in-store/${id_product}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.data || `Cannot delete store product #${id_product}`);
      }

      const updatedResponse = await fetch('http://127.0.0.1:5174/products-in-store');
      const updatedData = await updatedResponse.json();

      const parsedData = updatedData.data || JSON.parse(updatedData.body).data;
      setProductsInStore(parsedData);
    } catch (error) {
      console.error('Error editing the category:', error);
      alert(error.message);
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
          { key: 'products_number', label: 'Quantity' }
        ]}
        onSort={(field, order) => {
          if (!field || !order) {
            fetch('http://127.0.0.1:5174/products-in-store')
              .then(res => res.json())
              .then(data => {
                const parsed = JSON.parse(data.body).data;
                setProductsInStore(parsed);
              });
          } else {
            fetch(`http://127.0.0.1:5174/products-in-store/sort/${field}/${order}`)
              .then(res => res.json())
              .then(data => {
                const parsed = JSON.parse(data.body).data;
                setProductsInStore(parsed);
              });
          }
        }}
      />

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
        columns={[
          { key: "product_name", label: "Product Name" }
        ]}
      />
    </div>
  );
}

export default ProductsInStore;
