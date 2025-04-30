import React, { useState, useEffect, useImperativeHandle } from 'react';
import api from '../axios';

export default function FetchReceipts({ refetchRef }) {
    const [receipts, setReceipts] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [error, setError] = useState(null);
    const [modalData, setModalData] = useState(null);

    const fetchReceipts = async () => {
        try {
            const response = await api.get('/receipts');
            const parsedBody = JSON.parse(response.data.body);
            const parsedData = parsedBody.data ?? [];
            setReceipts(Array.isArray(parsedData) ? parsedData : []);
        } catch (err) {
            console.error('Error fetching receipts:', err);
            setReceipts([]);
            setError('Failed to fetch receipts.');
        }
    };

    useImperativeHandle(refetchRef, () => fetchReceipts);

    useEffect(() => {
        fetchReceipts();
    }, []);

    const prev = () => {
        setStartIndex(i => Math.max(i - 1, 0));
    };

    const next = () => {
        const maxIndex = receipts.length - 3;
        setStartIndex(i => (i < maxIndex ? i + 1 : i));
    };

    const openModal = (receipt) => {
        setModalData(receipt);
    };

    const closeModal = () => {
        setModalData(null);
    };

    if (error) return <div className="receipt-error">{error}</div>;
    if (!receipts.length) return <div className="receipt-loading">Loading receipts...</div>;

    const maxIndex = receipts.length - 3;

    return (
        <div className="receipt-carousel-container">
            <button
                className={`carousel-arrow left ${startIndex === 0 ? 'disabled' : ''}`}
                onClick={prev}
                aria-label="Previous Receipts"
            >
                ←
            </button>
            <div className="receipt-carousel">
                <div
                    className="receipt-strip"
                    style={{
                        transform: `translateX(-${startIndex * 320}px)`
                    }}
                >
                    {receipts.map((receipt, index) => {
                        const { check_number, id_employee, card_number, print_date, sum_total, vat, items } = receipt;
                        const isLongReceipt = items.length > 4;

                        return (
                            <div className="receipt-info" key={index}>
                                <h3>Receipt</h3>
                                <p><strong>Number:</strong> {check_number}</p>
                                <p><strong>Employee:</strong> {id_employee}</p>
                                <p><strong>Card Number:</strong> {card_number || 'None'}</p>
                                <p><strong>Date:</strong> {print_date}</p>
                                <h4>Products</h4>
                                {isLongReceipt ? (
                                    <>
                                        <p
                                            className="view-more"
                                            onClick={() => openModal(receipt)}
                                            style={{ cursor: 'pointer', color: 'black' }}
                                        >
                                            ...
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        {items && items.length > 0 && (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>UPC</th>
                                                        <th>Name</th>
                                                        <th>Qty</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>{item.UPC}</td>
                                                            <td>{item.product_name}</td>
                                                            <td>{item.product_number}</td>
                                                            <td>{item.selling_price}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </>
                                )}
                                <p><strong>Sum:</strong> {sum_total}</p>
                                <p><strong>VAT:</strong> {vat}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <button
                className={`carousel-arrow right ${startIndex >= maxIndex ? 'disabled' : ''}`}
                onClick={next}
                aria-label="Next Receipts"
            >
                →
            </button>

            {modalData && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="additional-modal-close-button">x</button>
                        <h4>Products</h4>
                        <table className="additional-modal-table">
                            <thead>
                                <tr>
                                    <th>UPC</th>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalData.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.UPC}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.product_number}</td>
                                        <td>{item.selling_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
