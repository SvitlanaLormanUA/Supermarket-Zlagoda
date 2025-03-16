import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';

function ProductsInStore() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5174/products')
      .then((res) => res.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body).data;
        console.log(parsedData);
        setProducts(parsedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <SearchAndBack />
      <h1>Products in Store</h1>
      <table>
        <thead>
          <tr>
            <th>UPC</th>
            <th>Promotional UPC</th>
            <th>Product Name</th>
            <th>Characteristics</th>
            <th>Category</th>
            <th>Price</th>
            <th>Products Number</th>
            <th>Promotional Product</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.UPC}</td>
              <td>{product.UPC_prom}</td>
              <td>{product.product_name}</td>
              <td>{product.characteristics}</td>
              <td>{product.category_name}</td>
              <td>{product.selling_price}</td>
              <td>{product.products_number}</td>
              <td>{product.promotional_product ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsInStore;
