import React from 'react';
import { Users, UserCheck, Package, ShoppingBag, FileText } from 'lucide-react';

function ReportButtons({ onReportSelect, onPrint, selectedReport }) {
  return (
    <div className="report-buttons no-print">
      <button className="report-button" onClick={() => onReportSelect('employees')}>
        <Users className="icon" />
        Employees
      </button>
      <button className="report-button" onClick={() => onReportSelect('customers-card')}>
        <UserCheck className="icon" />
        Customers
      </button>
      <button className="report-button" onClick={() => onReportSelect('products-in-store')}>
        <Package className="icon" />
        Store Products
      </button>
      <button className="report-button" onClick={() => onReportSelect('products')}>
        <ShoppingBag className="icon" />
        Products to Purchase
      </button>
      <button className="report-button" onClick={() => onReportSelect('receipts')}>
        <FileText className="icon" />
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