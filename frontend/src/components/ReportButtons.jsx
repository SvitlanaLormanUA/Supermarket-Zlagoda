import React from 'react';
import { useEffect } from 'react';
function ReportButtons({ onReportSelect, onPrint, selectedReport }) {
      useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest';
        script.onload = () => {
          if (window.lucide) {
            window.lucide.createIcons();
          }
        };
        document.body.appendChild(script);
      }, []);
  return (
    <div className="report-buttons no-print">
      <button className="report-button" onClick={() => onReportSelect('employees')}>
        <i data-lucide="users" className="icon"></i>
        Employees
      </button>
      <button className="report-button" onClick={() => onReportSelect('customers-card')}>
        <i data-lucide="user-check" className="icon"></i>
        Customers
      </button>
      <button className="report-button" onClick={() => onReportSelect('products-in-store')}>
        <i data-lucide="package" className="icon"></i>
        Store Products
      </button>
      <button className="report-button" onClick={() => onReportSelect('products')}>
        <i data-lucide="shopping-bag" className="icon"></i>
        Products to Purchase
      </button>
      <button className="report-button" onClick={() => onReportSelect('receipts')}>
        <i data-lucide="file-text" className="icon"></i>
        Receipts
      </button>

      {selectedReport && (
        <button className="report-button print-button" onClick={onPrint}>
          Print
        </button>
      )}
    </div>
  );
}

export default ReportButtons;
