import React, { useState, useEffect } from 'react';
import api from '../axios'; // Import the custom Axios instance
import SearchAndBack from './SearchAndBack';

function Receipts() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const initialFormData = {
    checkNumber: '',
    employeeId: '',
    cardNumber: '',
    printDate: '',
    sumTotal: '',
    vat: '',
  };

  const initialProductData = {
    UPC: '',
    product_number: '',
    selling_price: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [productData, setProductData] = useState(initialProductData);
  const [optionsMap, setOptionsMap] = useState({});
  const [products, setProducts] = useState([]);

  const fieldsStep1 = [
    { name: 'checkNumber', label: 'Receipt Number' },
    {
      name: 'employeeId',
      label: 'Employee',
      type: 'fk',
      fetchUrl: '/employee-by-ID', // Relative path (baseURL handled by axiosInstance)
      optionValue: 'id_employee',
      optionLabel: (e) => `${e.id_employee} – ${e.empl_surname}`,
    },
    {
      name: 'cardNumber',
      label: 'Card',
      type: 'fk',
      fetchUrl: '/customers-card',
      optionValue: 'card_number',
      optionLabel: (c) => `${c.card_number} (${c.cust_surname})`,
    },
    { name: 'printDate', label: 'Date', type: 'datetime-local' },
  ];

  const fieldsStep2 = [
    {
      name: 'UPC',
      label: 'UPC',
      type: 'fk',
      fetchUrl: '/products-in-store',
      optionValue: 'UPC',
      optionLabel: (pr) => `${pr.UPC} (${pr.product_name})`,
    },
    { name: 'product_number', label: 'Product Number' },
  ];

  const requiredStep1Fields = fieldsStep1
    .filter((f) => f.name !== 'cardNumber')
    .map((f) => f.name);

  const validateStep1 = () => {
    for (let fieldName of requiredStep1Fields) {
      if (!formData[fieldName]) {
        alert(`Field "${fieldName}" is required.`);
        return false;
      }
    }
    return true;
  };

  const validateBeforeSave = () => {
    if (products.length === 0) {
      alert('You must add at least one product to the receipt.');
      return false;
    }
    return true;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'UPC' && optionsMap.UPC) {
        const selected = optionsMap.UPC.find((opt) => opt.value === value);
        if (selected) {
          updated.selling_price = selected.raw.selling_price;
        }
      }

      return updated;
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setFormData(initialFormData);
    setProductData(initialProductData);
    setProducts([]);
  };

  const addProduct = () => {
    if (!productData.UPC || !productData.selling_price) return;

    const price = parseFloat(productData.selling_price);
    const vat = price * 0.2;

    const selected = optionsMap.UPC.find((opt) => opt.value === productData.UPC);
    const productName = selected?.raw?.product_name || '';

    const newProduct = {
      ...productData,
      selling_price: price.toFixed(2),
      vat: vat.toFixed(2),
      product_name: productName,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);

    const totalSum = updatedProducts.reduce(
      (sum, p) => sum + parseFloat(p.selling_price),
      0
    );
    const totalVat = updatedProducts.reduce(
      (sum, p) => sum + parseFloat(p.vat),
      0
    );

    setFormData((prev) => ({
      ...prev,
      sumTotal: totalSum.toFixed(2),
      vat: totalVat.toFixed(2),
    }));

    setProductData(initialProductData);
  };

  useEffect(() => {
    if (!showModal) return;

    const fetchAllOptions = async () => {
      const newOptions = {};

      const allFields = [...fieldsStep1, ...fieldsStep2];
      for (const field of allFields) {
        if (field.type === 'fk' && field.fetchUrl) {
          try {
            const res = await api.get(field.fetchUrl);
            // Assuming API returns { body: JSON string } based on original code
            const parsed = JSON.parse(res.data.body).data;
            newOptions[field.name] = parsed.map((item) => ({
              value: item[field.optionValue],
              label:
                typeof field.optionLabel === 'function'
                  ? field.optionLabel(item)
                  : item[field.optionLabel],
              raw: item,
            }));
          } catch (err) {
            console.error(`Failed to fetch ${field.name}:`, err);
            newOptions[field.name] = [];
          }
        }
      }

      setOptionsMap(newOptions);
    };

    fetchAllOptions();
  }, [showModal]);

  return (
    <div className="receipts-container">
      <SearchAndBack />
      <button className="addNewReceipt" onClick={() => setShowModal(true)}>
        Add
      </button>

      {showModal && (
        <div className="receipt-modal-overlay" onClick={closeModal}>
          <div
            className="receipt-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-left">
              <h3>Receipt</h3>
              <p>
                <strong>Number:</strong> {formData.checkNumber}
              </p>
              <p>
                <strong>Employee ID:</strong> {formData.employeeId}
              </p>
              <p>
                <strong>Card Number:</strong> {formData.cardNumber}
              </p>
              <p>
                <strong>Date:</strong> {formData.printDate}
              </p>

              {products.length > 0 && (
                <>
                  <h4>Products</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>UPC</th>
                        <th>Name</th>
                        <th>Product #</th>
                        <th>Price</th>
                        <th>VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, idx) => (
                        <tr key={idx}>
                          <td>{p.UPC}</td>
                          <td>{p.product_name}</td>
                          <td>{p.product_number}</td>
                          <td>{p.selling_price}</td>
                          <td>{p.vat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <p>
                <strong>Sum:</strong> {formData.sumTotal}
              </p>
              <p>
                <strong>VAT:</strong> {formData.vat}
              </p>
            </div>

            <div className="modal-right">
              <div className="receipt-modal-header">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="back-button"
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="close-button"
                >
                  ×
                </button>
              </div>
              <h3>{step === 1 ? 'Receipt Info' : 'Add Product'}</h3>
              {(step === 1 ? fieldsStep1 : fieldsStep2).map((field) => (
                <div key={field.name}>
                  {field.type === 'fk' ? (
                    <select
                      name={field.name}
                      value={
                        step === 1
                          ? formData[field.name]
                          : productData[field.name]
                      }
                      onChange={step === 1 ? handleFormChange : handleProductChange}
                    >
                      <option value="">{`Select ${field.label}`}</option>
                      {(optionsMap[field.name] || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'datetime-local' ? (
                    <input
                      type="datetime-local"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleFormChange}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.label}
                      value={
                        step === 1
                          ? formData[field.name]
                          : productData[field.name]
                      }
                      onChange={step === 1 ? handleFormChange : handleProductChange}
                    />
                  )}
                </div>
              ))}

              <div className="modal-actions">
                {step === 1 ? (
                  <button
                    className="save-button"
                    onClick={() => {
                      if (validateStep1()) {
                        setStep(2);
                      }
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <>
                    <button className="save-button" onClick={addProduct}>
                      Add Product
                    </button>
                    <button
                      className="save-button"
                      onClick={() => {
                        if (validateBeforeSave()) {
                          console.log('Final data:', { ...formData, products });
                          closeModal();
                        }
                      }}
                    >
                      Save Receipt
                    </button>
                  </>
                )}
                <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Receipts;