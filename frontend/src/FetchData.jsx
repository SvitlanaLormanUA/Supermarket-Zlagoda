import { useState, useEffect } from 'react';
// дані з бекенду я передаю так:
//  {"status_code":200,
// "body":"{\"data\":[{\"UPC\":\"123456789012\",
// \"UPC_prom\":null,\"product_name\":\"cream\",
// \"characteristics\":\"a dairy product made from the high-fat layer skimmed from the top of milk\",\"category_name\":\"diary\",\"selling_price\":2.99,
// \"products_number\":100,\"promotional_product\":false},{\"UPC\":\"234567890123\",\"UPC_prom\":\"123456789012\",\"product_name\":\"yougurt\",\"characteristics\":\"a dairy product made by bacterial fermentation of milk\",\"category_name\":\"diary\",\"selling_price\":5.49,\"products_number\":50,\"promotional_product\":true},{\"UPC\":\"345678901234\",\"UPC_prom\":\"123456789012\",\"product_name\":\"apple\",\"characteristics\":\"a round fruit with red or green skin and sweet flesh\",\"category_name\":\"fruit\",\"selling_price\":1.99,\"products_number\":20,\"promotional_product\":true},{\"UPC\":\"456789012345\",\"UPC_prom\":\"234567890123\",\"product_name\":\"banana\",\"characteristics\":\"a long, curved fruit with a yellow skin and soft, sweet flesh\",\"category_name\":\"fruit\",\"selling_price\":4.79,\"products_number\":25,\"promotional_product\":true},{\"UPC\":\"567890123456\",\"UPC_prom\":null,\"product_name\":\"carrot\",\"characteristics\":\"a root vegetable, typically orange in color\",\"category_name\":\"vegetables\",\"selling_price\":2.99,\"products_number\":100,\"promotional_product\":false}]}",
// "headers":{"Content-Type":"application/json"}}

const Fetch = () => {
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