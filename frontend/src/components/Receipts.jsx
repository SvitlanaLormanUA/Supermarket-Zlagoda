import React, { useState, useEffect } from 'react';
import { validateReceiptStep1, validateReceiptBeforeSave } from '../utils/Validation';
import api from '../axios';

// Logic and Validation of receipts
function Receipts({ showModal, setShowModal, onReceiptAdded }) {
    const [step, setStep] = useState(1);

    const initialFormData = {
        check_number: '',
        id_employee: '',
        card_number: '',
        print_date: '',
        sum_total: '',
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
        { name: 'check_number', label: 'Receipt Number' },
        {
            name: 'id_employee',
            label: 'Employee',
            type: 'fk',
            fetchUrl: '/employees/cashiers',
            optionValue: 'id_employee',
            optionLabel: (e) => `${e.id_employee} – ${e.empl_surname}`,
        },
        {
            name: 'card_number',
            label: 'Card',
            type: 'fk',
            fetchUrl: '/customers-card',
            optionValue: 'card_number',
            optionLabel: (c) => `${c.card_number} (${c.cust_surname})`,
        },
        { name: 'print_date', label: 'Date', type: 'datetime-local' },
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
        .filter((f) => f.name !== 'card_number')
        .map((f) => f.name);


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
        if (!productData.UPC || !productData.selling_price || !productData.product_number) return;

        const price = parseFloat(productData.selling_price);
        const quantity = parseInt(productData.product_number, 10);

        const selected = optionsMap.UPC.find((opt) => opt.value === productData.UPC);
        const productName = selected?.raw?.product_name || '';

        const totalPrice = price * quantity;
        const vat = totalPrice * 0.2;

        const newProduct = {
            ...productData,
            selling_price: price.toFixed(2),
            quantity,
            total_price: totalPrice.toFixed(2),
            vat: vat.toFixed(2),
            product_name: productName,
        };

        const updatedProducts = [...products, newProduct];
        setProducts(updatedProducts);

        const totalSum = updatedProducts.reduce(
            (sum, p) => sum + parseFloat(p.total_price),
            0
        );
        const totalVat = updatedProducts.reduce(
            (sum, p) => sum + parseFloat(p.vat),
            0
        );

        setFormData((prev) => ({
            ...prev,
            sum_total: totalSum.toFixed(2),
            vat: totalVat.toFixed(2),
        }));

        setProductData(initialProductData);
    };

    const addReceipt = async () => {
        try {
            console.log('Saving receipt...');
            console.log('Form Data:', formData);
            console.log('Products:', products);
    
            const payload = {
                ...formData,
                products,
            };
            const response = await api.post('/receipts/new_receipt', payload);
            alert('Receipt saved successfully!');
            onReceiptAdded && onReceiptAdded();
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert(error.response?.data?.detail || 'Error saving receipt.');
        }
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
        <>
            {showModal && (
                <div className="receipt-modal-overlay" onClick={closeModal}>
                    <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-left">
                            <h3>Receipt</h3>
                            <p><strong>Number:</strong> {formData.check_number}</p>
                            <p><strong>Employee ID:</strong> {formData.id_employee}</p>
                            <p><strong>Card Number:</strong> {formData.card_number}</p>
                            <p><strong>Date:</strong> {formData.print_date}</p>

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
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((p, idx) => (
                                                <tr key={idx}>
                                                    <td>{p.UPC}</td>
                                                    <td>{p.product_name}</td>
                                                    <td>{p.product_number}</td>
                                                    <td>{p.selling_price}</td>
                                                    <td>{p.total_price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                            <p><strong>Sum:</strong> {formData.sum_total}</p>
                            <p><strong>VAT:</strong> {formData.vat}</p>
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
                                            if (validateReceiptStep1(formData, requiredStep1Fields)) {
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
                                            onClick={async () => {
                                                if (validateReceiptBeforeSave(products)) {
                                                    await addReceipt();
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
        </>
    );
}

export default Receipts;