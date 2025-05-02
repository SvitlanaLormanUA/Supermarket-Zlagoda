import React, { useState, useRef } from 'react';
import Receipts from './Receipts';
import { Link } from 'react-router-dom';
import SearchAndBack from './SearchAndBack';
import FetchReceipts from './FetchReceipts';

function ReceiptPage({ userRole }) {
    const fetchReceiptsRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const handleFetchUpdate = () => {
        if (fetchReceiptsRef.current) {
            fetchReceiptsRef.current();
        }
    };
    return (
        <div className="receipts-container">
            <div className="searchAndBackSection">
                <SearchAndBack />
            </div>
            <div className="receipt-action-buttons">
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
            </div>

            <Receipts userRole={userRole} showModal={showModal} setShowModal={setShowModal} onReceiptAdded={handleFetchUpdate} />
            <FetchReceipts refetchRef={fetchReceiptsRef} />
        </div>
    );
}

export default ReceiptPage;
