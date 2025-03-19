import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';

function ProductsInStore() {
  const [products, setProducts] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);

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

  return (
    <div className="products-container">
      <div className="searchAndBackSection">
        <SearchAndBack />
      </div>

      <div className="action-buttons">
        <button className="action-button add-button">Add</button>
        <button className="action-button edit-button">Edit</button>
        <button className="action-button delete-button">Delete</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th colSpan="2">Products In Store</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <React.Fragment key={index}>
              <tr className="product-row-header"onClick={() => toggleProduct(index)} style={{ cursor: 'pointer' }}>
                <td>{product.product_name}</td>
                <td style={{ textAlign: 'right' }}>
                  {product.UPC}
                  <span style={{ marginLeft: '10px' }}>
                    {openProduct === index ? '▲' : '▼'}
                  </span>
                </td>
              </tr>
              {openProduct === index && (
                <tr className="product-details-row">
                  <td colSpan="2">
                    <div className="product-details">
                      <p><strong>Promotional UPC:</strong> {product.UPC_prom || '—'}</p>
                      <p><strong>Characteristics:</strong> {product.characteristics || '—'}</p>
                      <p><strong>Category:</strong> {product.category_name || '—'}</p>
                      <p><strong>Price:</strong> {product.selling_price}$</p>
                      <p><strong>Products Number:</strong> {product.products_number}</p>
                      <p><strong>Promotional Product:</strong> {product.promotional_product ? 'Yes' : 'No'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsInStore;
