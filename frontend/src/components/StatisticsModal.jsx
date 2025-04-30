import React from 'react';

function StatisticsModal({ data, onClose, title }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>✖</button>
                <h2>{title || 'Result'}</h2>
                {data ? (
                    <div>
                        {Object.keys(data).map((key) => (
                            <p key={key}><strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {data[key]}</p>
                        ))}
                    </div>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
}

export default StatisticsModal;
