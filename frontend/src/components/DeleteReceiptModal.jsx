import React, { useState } from 'react';

const DeleteReceiptModal = ({ isOpen, onClose, onDelete }) => {
    const [receiptId, setReceiptId] = useState('');

    const handleDelete = () => {
        if (!receiptId) alert('No such receipt')
        if (receiptId.trim()) {
            onDelete(receiptId.trim());
            setReceiptId('');
            alert('deleted successfully')
        } 
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Видалити чек</h2>
                <input
                    type="text"
                    placeholder="Введіть ID чеку"
                    value={receiptId}
                    onChange={(e) => setReceiptId(e.target.value)}
                />
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={handleDelete}>Видалити</button>
                    <button className="cancel-btn" onClick={onClose}>Скасувати</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteReceiptModal;
