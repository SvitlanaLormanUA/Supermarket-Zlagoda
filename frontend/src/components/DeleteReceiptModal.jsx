import React, { useState, useEffect } from 'react';
import api from '../axios';

const DeleteReceiptModal = ({ isOpen, onClose, onDelete }) => {
    const [checkNumber, setCheckNumber] = useState('');
    const [checkNumbers, setCheckNumbers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            api.get('/receipts')
                .then((res) => {
                    const parsedBody = JSON.parse(res.data.body);
                    const receipts = parsedBody.data || [];
                    const numbers = receipts.map(receipt => receipt.check_number);
                    setCheckNumbers(numbers);
                })
                .catch((err) => {
                    console.error('Error fetching receipts:', err);
                    alert('Error fetching receipts');
                });
        }
    }, [isOpen]);



    const handleDelete = () => {
        if (!checkNumber) {
            alert('Choose receipt to delete');
            return;
        }
        onDelete(checkNumber);
        setCheckNumber('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Delete Receipt</h2>
                <select
                    value={checkNumber}
                    onChange={(e) => {
                        setCheckNumber(e.target.value);
                    }}
                >
                    <option value="">-- Choose Receipt --</option>
                    {checkNumbers.map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={handleDelete}>delete</button>
                    <button className="cancel-btn" onClick={onClose}>cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteReceiptModal;
