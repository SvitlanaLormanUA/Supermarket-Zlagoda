import React, { useEffect, useState } from 'react';
import api from '../axios';

function ReportTable({ reportType, products }) {
  const [productQuantities, setProductQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const getDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
  };

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
      <div className={`table-wrapper ${isPrinting ? 'table-wrapper--printing' : ''}`}>
        <table className={`report-table report-table--${reportType}`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Product Name</th>
              <th>Characteristics</th>
              {reportType === 'products' && <th>Total Sold Quantity (last 7 days)</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id_product}>
                <td className="table-cell">{prod.id_product}</td>
                <td className="table-cell">{prod.category_name}</td>
                <td className="table-cell">{prod.product_name}</td>
                <td className="table-cell">{prod.characteristics}</td>
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
      <div className={`table-wrapper ${isPrinting ? 'table-wrapper--printing' : ''}`}>
        <table className="report-table report-table--employees">
          <thead>
            <tr>
              <th className="table-cell">ID</th>
              <th className="table-cell">Surname</th>
              <th className="table-cell">Name</th>
              <th className="table-cell">Patronymic</th>
              <th className="table-cell">Role</th>
              <th className="table-cell">Salary</th>
              <th className="table-cell">Date of Birth</th>
              <th className="table-cell">Start Date</th>
              <th className="table-cell">Phone Number</th>
              <th className="table-cell">City</th>
              <th className="table-cell">Street</th>
              <th className="table-cell">ZIP Code</th>
            </tr>
          </thead>
          <tbody>
            {products.map((emp) => (
              <tr key={emp.id_employee}>
                <td className="table-cell">{emp.id_employee}</td>
                <td className="table-cell">{emp.empl_surname}</td>
                <td className="table-cell">{emp.empl_name}</td>
                <td className="table-cell">{emp.empl_patronymic ?? '-'}</td>
                <td className="table-cell">{emp.empl_role}</td>
                <td className="table-cell">{emp.salary}</td>
                <td className="table-cell">{emp.date_of_birth}</td>
                <td className="table-cell">{emp.date_of_start}</td>
                <td className="table-cell">{emp.phone_number}</td>
                <td className="table-cell">{emp.city}</td>
                <td className="table-cell">{emp.street}</td>
                <td className="table-cell">{emp.zip_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reportType === 'customers-card') {
    return (
      <div className={`table-wrapper ${isPrinting ? 'table-wrapper--printing' : ''}`}>
        <table className="report-table report-table--customers-card">
          <thead>
            <tr>
              <th className="table-cell">Card Number</th>
              <th className="table-cell">Surname</th>
              <th className="table-cell">Name</th>
              <th className="table-cell">Patronymic</th>
              <th className="table-cell">Phone Number</th>
              <th className="table-cell">City</th>
              <th className="table-cell">Street</th>
              <th className="table-cell">ZIP Code</th>
              <th className="table-cell">Discount (%)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((client) => (
              <tr key={client.card_number}>
                <td className="table-cell">{client.card_number}</td>
                <td className="table-cell">{client.cust_surname}</td>
                <td className="table-cell">{client.cust_name}</td>
                <td className="table-cell">{client.cust_patronymic ?? '-'}</td>
                <td className="table-cell">{client.phone_number}</td>
                <td className="table-cell">{client.city}</td>
                <td className="table-cell">{client.street}</td>
                <td className="table-cell">{client.zip_code}</td>
                <td className="table-cell">{client.percent}</td>
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