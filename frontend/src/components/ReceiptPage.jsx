import React, { useState, useRef } from 'react';
import Receipts from './Receipts';
import SearchAndBack from './SearchAndBack';
import FetchReceipts from './FetchReceipts';

function ReceiptPage() {
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

            <button className="add_new_receipt" onClick={() => setShowModal(true)}>
                Add New Receipt
            </button>

            <Receipts showModal={showModal} setShowModal={setShowModal} onReceiptAdded={handleFetchUpdate} />
            <FetchReceipts refetchRef={fetchReceiptsRef} />
        </div>
    );
}

export default ReceiptPage;
