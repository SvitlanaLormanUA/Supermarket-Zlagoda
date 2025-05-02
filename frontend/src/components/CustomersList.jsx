import React, { useState } from "react";

const CustomersList = ({ customerCards }) => {
    return (
        <div className="card-container">
            {customerCards.map((card) => (
                <div key={card.card_number} className="customer-card">
                    <div className="card-content">
                        <div className="card-header">
                            <div className="card-info">
                                <h3>{card.card_number}</h3>
                            </div>
                            <span className="customer-name">{card.cust_surname} {card.cust_name} {card.cust_patronymic}</span>
                        </div>
                        <div className="card-body">
                            <p>{card.city}, {card.street}, {card.zip_code}</p>
                            <p>Phone: {card.phone_number}</p>
                            <p>Discount: {card.percent}%</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CustomersList;
