import React, { useEffect, useState } from 'react';
import api from '../axios';

function ReportTable({ reportType, products }) {
  const [productQuantities, setProductQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  // Отримуємо дати (сьогодні та 7 днів тому)
  const getDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };

  // Запит кількості проданих товарів
  useEffect(() => {
    if (reportType === 'products') {
      const fetchProductQuantities = async () => {
        setLoading(true);
        const { start_date, end_date } = getDates();
        const quantities = {};
        
        try {
          // Запит для кожного продукту
          for (const product of products) {
            const response = await api.get(`/sales/product?product_id=${product.id_product}&start_date=${start_date}&end_date=${end_date}`);
            const data = response.data;
            
            if (data.status === 'success') {
              quantities[product.id_product] = data.data.total_quantity || 0;
            } else {
              quantities[product.id_product] = 0;
            }
          }
          
          setProductQuantities(quantities);
        } catch (error) {
          console.error('Error fetching product quantities:', error);
          // Якщо помилка, встановлюємо 0 для всіх продуктів
          const zeroQuantities = {};
          products.forEach(p => zeroQuantities[p.id_product] = 0);
          setProductQuantities(zeroQuantities);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProductQuantities();
    }
  }, [reportType, products]);

  const calculateTotalProductSales = () => {
    return Object.values(productQuantities).reduce((total, quantity) => total + quantity, 0);
  };

  const calculateTotalReceiptSales = () => {
    return products.reduce((total, receipt) => {
      return total + (parseFloat(receipt.sum_total) || 0);
    }, 0);
  };

  if (reportType === 'products' || reportType === 'products-in-store') {
    const totalSales = calculateTotalProductSales();

    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Number</th>
              <th>Category Name</th>
              <th>Product Name</th>
              <th>Characteristics</th>
              {reportType === 'products' && <th>Total Sold Quantity (last 7 days)</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id_product}>
                <td>{prod.id_product}</td>
                <td>{prod.category_number}</td>
                <td>{prod.category_name}</td>
                <td>{prod.product_name}</td>
                <td>{prod.characteristics}</td>
                {reportType === 'products' && (
                  <td>
                    {loading ? 'Loading...' : (productQuantities[prod.id_product] || 0)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          {reportType === 'products' && (
            <tfoot>
              <tr>
                <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total Sales:
                </td>
                <td style={{ fontWeight: 'bold' }}>
                  {loading ? 'Loading...' : totalSales}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  }


  if (reportType === 'employees') {
    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Surname</th>
              <th>Name</th>
              <th>Patronymic</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Date of Birth</th>
              <th>Start Date</th>
              <th>Phone Number</th>
              <th>City</th>
              <th>Street</th>
              <th>ZIP Code</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((emp) => (
              <tr key={emp.id_employee}>
                <td>{emp.id_employee}</td>
                <td>{emp.empl_surname}</td>
                <td>{emp.empl_name}</td>
                <td>{emp.empl_patronymic ?? '-'}</td>
                <td>{emp.empl_role}</td>
                <td>{emp.salary}</td>
                <td>{emp.date_of_birth}</td>
                <td>{emp.date_of_start}</td>
                <td>{emp.phone_number}</td>
                <td>{emp.city}</td>
                <td>{emp.street}</td>
                <td>{emp.zip_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'customers-card') {
    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Card Number</th>
              <th>Surname</th>
              <th>Name</th>
              <th>Patronymic</th>
              <th>Phone Number</th>
              <th>City</th>
              <th>Street</th>
              <th>ZIP Code</th>
              <th>Discount (%)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((client) => (
              <tr key={client.card_number}>
                <td>{client.card_number}</td>
                <td>{client.cust_surname}</td>
                <td>{client.cust_name}</td>
                <td>{client.cust_patronymic ?? '-'}</td>
                <td>{client.phone_number}</td>
                <td>{client.city}</td>
                <td>{client.street}</td>
                <td>{client.zip_code}</td>
                <td>{client.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'receipts') {
    const totalSales = calculateTotalReceiptSales();

    return (
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Cashier ID</th>
              <th>Cashier Name</th>
              <th>Check Number</th>
              <th>Card Number</th>
              <th>Print Date</th>
              <th>Total Sum</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {products.map((receipt) => (
              <tr key={receipt.check_number}>
                <td>{receipt.id_employee}</td>
                <td>{receipt.employee_name}</td>
                <td>{receipt.check_number}</td>
                <td>{receipt.card_number || '-'}</td>
                <td>{new Date(receipt.print_date).toLocaleString()}</td>
                <td>{parseFloat(receipt.sum_total).toFixed(2)}</td>
                <td>
                  {receipt.items && receipt.items.length > 0 ? (
                    <table 
                      border="1" 
                      cellPadding="5" 
                      style={{ 
                        width: '100%', 
                        backgroundColor: '#f5f5f5',
                        borderColor: '#ddd'
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: '#e0e0e0' }}>
                          <th>UPC</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipt.items.map((item, index) => (
                          <tr key={`${receipt.check_number}-item-${index}`}>
                            <td>{item.UPC}</td>
                            <td>{item.product_name}</td>
                            <td>{item.product_number}</td>
                            <td>{parseFloat(item.selling_price).toFixed(2)}</td>
                            <td>{(item.product_number * parseFloat(item.selling_price)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    'No products'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total Sales:
              </td>
              <td colSpan="2" style={{ fontWeight: 'bold' }}>
                {totalSales.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  return null;
}

export default ReportTable;