import React from 'react';

function StatisticsModal({ data, onClose, title }) {
    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return (
                <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                    {value.map((v, i) => (
                        <li key={i}>{typeof v === 'object' ? renderObject(v) : String(v)}</li>
                    ))}
                </ul>
            );
        } else if (typeof value === 'object' && value !== null) {
            return renderObject(value);
        } else {
            return String(value);
        }
    };

    const renderObject = (obj) => {
        return (
            <div style={{ padding: '10px', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#f9f9f9' }}>
                {Object.entries(obj).map(([key, val]) => (
                    <p key={key} style={{ margin: '6px 0' }}>
                        <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {renderValue(val)}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="receipt-modal-overlay" onClick={onClose}>
            <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-left">
                    <div className="receipt-modal-header">
                        <h2>{title || 'Receipt Details'}</h2>
                        <button className="close-button" onClick={onClose}>✖</button>
                    </div>
                    {data ? (
                        Array.isArray(data) ? (
                            data.map((item, index) => (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <div style={{
                                        borderBottom: '1px solid #ccc',
                                        paddingBottom: '10px'
                                    }}>
                                        <h4 style={{ marginBottom: '10px', color: '#333' }}>Receipt #{index + 1}</h4>
                                        {renderObject(item)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>{renderObject(data)}</div>
                        )
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StatisticsModal;
