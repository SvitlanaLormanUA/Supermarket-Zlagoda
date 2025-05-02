import React from 'react';
import { Users, UserCheck, Package, ShoppingBag, FileText } from 'lucide-react';

function ReportButtons({ onReportSelect, onPrint, selectedReport = 'employees' }) {
  return (
    <div className="report-buttons no-print">
      <button 
        className={`report-button ${selectedReport === 'employees' ? 'active' : ''}`} 
        onClick={() => onReportSelect('employees')}
      >
        <Users className="icon" />
        Employees
      </button>
      <button 
        className={`report-button ${selectedReport === 'customers-card' ? 'active' : ''}`} 
        onClick={() => onReportSelect('customers-card')}
      >
        <UserCheck className="icon" />
        Customers
      </button>
      <button 
        className={`report-button ${selectedReport === 'products-in-store' ? 'active' : ''}`} 
        onClick={() => onReportSelect('products-in-store')}
      >
        <Package className="icon" />
        Store Products
      </button>
      <button 
        className={`report-button ${selectedReport === 'products' ? 'active' : ''}`} 
        onClick={() => onReportSelect('products')}
      >
        <ShoppingBag className="icon" />
        Products to Purchase
      </button>
      <button 
        className={`report-button ${selectedReport === 'receipts' ? 'active' : ''}`} 
        onClick={() => onReportSelect('receipts')}
      >
        <FileText className="icon" />
        Sales
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