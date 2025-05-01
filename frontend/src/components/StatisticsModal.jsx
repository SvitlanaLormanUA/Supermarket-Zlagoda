import React from 'react';

function StatisticsModal({ data, onClose, title }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>✖</button>
                <h2>{title || 'Result'}</h2>
                {data ? (
                    <div>
                        {Array.isArray(data) ? (
                            data.map((item, index) => (
                                <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                    {Object.keys(item).map((key) => (
                                        <p key={key}>
                                            <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {item[key]}
                                        </p>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div>
                                {Object.keys(data).map((key) => (
                                    <p key={key}>
                                        <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {data[key]}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
}

export default StatisticsModal;