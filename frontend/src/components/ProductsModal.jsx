import React from 'react';

const ProductsModal = ({ isOpen, onClose, products }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div style={{ width: '1.5rem' }} />
                    <h2 className="modal-title">Products</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <ul>
                    {products.map((prod) => (
                        <li key={prod.product_number}>
                            {prod.product_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductsModal;
