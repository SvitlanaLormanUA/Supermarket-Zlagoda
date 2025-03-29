import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';

function ProductsInStore() {
  const [products, setProducts] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const productFields = [
    { name: "product_name", label: "Name" },
    { name: "product_price", label: "Price" },
    // not all fields(just example)
  ];

  useEffect(() => {
    fetch('http://127.0.0.1:5174/products')
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body).data;
        setProducts(parsedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const toggleProduct = (index) => {
    setOpenProduct(openProduct === index ? null : index);
  };

  const addProduct = (data) => {
    // example
    console.log("Add product clicked");
  };

  const editProduct = () => {
    // example
    console.log("Edit product clicked");
  };

  const deleteProduct = () => {
    // example
    console.log("Delete product clicked");
  };

  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <ControlButtons
        onAdd={addProduct}
        onEdit={editProduct}
        onDelete={deleteProduct}
        modalFields={productFields}
      />

      <CustomTable
        title="Products In Store"
        columns={[
          { key: "product_name", label: "Product Name" }
        ]}
        data={products}
      />
    </div>
  );
}

export default ProductsInStore;
