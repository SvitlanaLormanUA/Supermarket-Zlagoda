import React, { useState, useRef } from 'react';
import Receipts from './Receipts';
import { Link } from 'react-router-dom';
import SearchAndBack from './SearchAndBack';
import FetchReceipts from './FetchReceipts';
import api from '../axios'; 
import DeleteReceiptModal from './DeleteReceiptModal';
function ReceiptPage({ userRole }) {
    const fetchReceiptsRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleFetchUpdate = () => {
        if (fetchReceiptsRef.current) {
            fetchReceiptsRef.current();
        }
    };

    const deleteReceipt = async (receiptId) => {
        try {
            await api.delete(`/receipts/${receiptId}`);
            alert('Receipt deleted successfully!');
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.response?.data?.detail || 'Failed to delete receipt.');
        }
    };

    const handleDeleteReceipt = async (receiptId) => {
       
        await deleteReceipt(receiptId);
        handleFetchUpdate(); 
    };

    return (
        <div className="receipts-container">
            <div className="searchAndBackSection">
                <SearchAndBack />
            </div>
            <div className="receipt-action-buttons">
                {userRole === 'Manager' && 
                    <button className="add_new_receipt" onClick={() => setShowDeleteModal(true)}>
                        Delete Receipt
                    </button>
                }
                 {userRole !== 'Manager' && 
                <button className="add_new_receipt" onClick={() => setShowModal(true)}>
                    Add New Receipt
                </button>
 } 
                {userRole === 'Manager' && 
                    <Link to="/receipts/statistics" className="receipt_statistics">
                        Statistics
                    </Link>
                }
                <DeleteReceiptModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={(id) => {
                        handleDeleteReceipt(id);
                        setShowDeleteModal(false);
                    }}
/>
            </div>
            <Receipts userRole={userRole} showModal={showModal} setShowModal={setShowModal} onReceiptAdded={handleFetchUpdate} />
            <FetchReceipts refetchRef={fetchReceiptsRef} />
        </div>
    );
}

export default ReceiptPage;
