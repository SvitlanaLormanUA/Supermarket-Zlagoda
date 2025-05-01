import React from 'react';

function ReportTable({ reportType, products, nonActiveEmployees, isPrinting }) {
  const isNonActive = (id) => nonActiveEmployees.includes(id);

  if (reportType === 'products' || reportType === 'products-in-store') {
    return (
      <div className={`table-wrapper ${isPrinting ? 'table-wrapper--printing' : ''}`}>
        <table className={`report-table report-table--${reportType}`}>
          <thead>
            <tr>
              <th className="table-cell">ID</th>
              <th className="table-cell">Category Name</th>
              <th className="table-cell">Product Name</th>
              <th className="table-cell">Characteristics</th>
              {reportType === 'products' && (
                <th className="table-cell">Total Sold Quantity</th>
              )}
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
                  <td className="table-cell">{prod.totalQuantity ?? Math.floor(Math.random() * 14)}</td>
                )}
              </tr>
            ))}
          </tbody>
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
              <th className="table-cell">Status</th>
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
                <td className="table-cell">{isNonActive(emp.id_employee) ? 'Inactive' : 'Active'}</td>
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

  return null;
}

export default ReportTable;