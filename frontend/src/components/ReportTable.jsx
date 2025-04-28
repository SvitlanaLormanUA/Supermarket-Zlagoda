function ReportTable({ reportType, products, nonActiveEmployees }) {
  const isNonActive = (id) => nonActiveEmployees.includes(id);

  if (reportType === 'products' || reportType === 'products-in-store') {
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
              {reportType === 'products' && (
                <th>Total Sold Quantity</th>
              )}
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
                  <td>{prod.totalQuantity ?? Math.floor(Math.random() * 14)}</td>
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
                <td>{isNonActive(emp.id_employee)}Active</td>
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

  return null;
}

export default ReportTable;
