import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import EditItemModal from "./EditItemModal";
import DeleteItemModal from "./DeleteItemModal";

function ProductsInStore() {
  const [productsInStore, setProductsInStore] = useState([]);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [productOptions, setProductOptions] = useState([]);
  const [UPCOptions, setUPCOptions] = useState([]);

  const productsInStoreFields = [
    { name: "UPC", label: "UPC" },
    { name: "UPC_prom", label: "UPC_prom", type: "fk", options: UPCOptions },
    { name: "id_product", label: "Product ID", type: "fk", options: productOptions },
    { name: "selling_price", label: "Price" },
    { name: "products_number", label: "Products Number" },
    { name: "promotional_product", label: "Promotional Product", type: "boolean" }
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:5174/products')
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
    fetch('http://127.0.0.1:5174/allproducts')
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

  const addProductsInStore = () => {
    // example

  };

  const editProductsInStore = () => {
    // example

  };

  const deleteProductsInStore = () => {
    // example

  };

  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <ControlButtons
        onAdd={(data) => addProductsInStore(data)}
        onEdit={(ids) => editProductsInStore(ids)}
        onDelete={(ids) => deleteProductsInStore(ids)}
        modalFields={productsInStoreFields}
        deleteItems={productsInStore}
        itemKey="product_name"
        itemIdKey="UPC"
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
        itemIdKey="UPC"
      />

      <DeleteItemModal
        items={productsInStore}
        itemKey="product_name"
        itemIdKey="UPC"
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
