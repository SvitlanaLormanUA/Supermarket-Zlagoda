import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReportTable from './ReportTable';
import ReportHeader from './ReportHeader';
import ReportButtons from './ReportButtons';
import api from '../axios';

function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [nonActiveEmployees, setNonActiveEmployees] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const reportType = searchParams.get('report');

  useEffect(() => {
    if (!reportType) return;

    let query = `/${reportType}`;
    console.log('Fetching data for report type:', query);
    fetchFunction(query);

    if (reportType === 'employees') {
      fetchNonActiveEmployees();
    }
  }, [reportType]);

  const fetchFunction = async (reportType) => {
    try {
      const response = await api.get(`${reportType}`);
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;

      if (reportType === 'products') {
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';

        const productsWithSales = await Promise.all(parsedData.map(async (product) => {
          try {
            const salesResponse = await api.get('/sales/product', {
              params: {
                product_id: product.id_product,
                start_date: startDate,
                end_date: endDate,
              }
            });

            const totalQuantity = salesResponse.data.data?.total_quantity ?? 0;
            return { ...product, totalQuantity };
          } catch (salesError) {
            console.error(`Error fetching sales for product ${product.id_product}:`, salesError);
            return { ...product, totalQuantity: 0 };
          }
        }));

        setProducts(productsWithSales);
      } else {
        setProducts(parsedData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchNonActiveEmployees = async () => {
    try {
      const response = await api.get('/employees/inactive-accounts');
      const data = response.data.data ?? JSON.parse(response.data.body).data;
      const nonActiveIds = data.map(emp => emp.id_employee);
      console.log('Non-active employee IDs:', nonActiveIds);
      setNonActiveEmployees(nonActiveIds);
    } catch (error) {
      console.error('Error fetching non-active employees:', error);
    }
  };

  const handleReportButtonClick = (type) => {
    setSearchParams({ report: type });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      <ReportHeader />
      <ReportButtons
        onReportSelect={handleReportButtonClick}
        onPrint={handlePrint}
        selectedReport={reportType}
      />
      <div className="printable-section">
        <ReportTable
          reportType={reportType}
          products={products}
          nonActiveEmployees={nonActiveEmployees}
        />
      </div>
    </div>
  );
}

export default ReportsPage;
