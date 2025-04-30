import React, { useState } from 'react';
import Receipts from './Receipts';
import SearchAndBack from './SearchAndBack';
import FetchReceipts from './FetchReceipts';

function ReceiptPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="receipts-container">
            <div className="searchAndBackSection">
                <SearchAndBack />
            </div>

            <button className="add_new_receipt" onClick={() => setShowModal(true)}>
                Add New Receipt
            </button>

            <FetchReceipts />

            <Receipts showModal={showModal} setShowModal={setShowModal} />
        </div>
    );
}

export default ReceiptPage;
