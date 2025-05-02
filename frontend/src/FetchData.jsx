import { useState, useEffect } from 'react';
import api from 'axios';

const Fetch = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const parsedData = JSON.parse(res.data.body).data;
        console.log(parsedData);
        setProducts(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.UPC}>
          <h3>{product.product_name}</h3>
          <p>{product.characteristics}</p>
          <p>Price: ${product.selling_price}</p>
          <p>Category: {product.category_name}</p>
          <p>In Stock: {product.products_number}</p>
        </div>
      ))}
    </div>
  );
};

export default Fetch;