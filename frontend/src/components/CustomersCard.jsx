import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';

function CustomersCard() {
    const [customerCards, setCustomerCards] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5174/customers-card')
            .then((res) => res.json())
            .then((data) => {
                const parsedData = JSON.parse(data.body).data;
                setCustomerCards(parsedData || []);
            })
            .catch((error) => {
                console.error('Error fetching customer cards:', error);
                setCustomerCards([]);
            });
    }, []);

    return (
        <div>
            <div className="cards-container">
                <div className="searchAndBackSection">
                    <SearchAndBack />
                </div>
                <div className="search-bar-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by surname..."
                    />
                </div>
                <div className="card-container">
                    {customerCards.map((card) => (
                        <div key={card.card_number} className="customer-card">
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="card-info">
                                        <h3>{card.card_number}</h3>
                                        <div className="card-actions">
                                            <button className="edit-btn">
                                                <img src="/assets/images/edit.png" alt="Edit" />
                                            </button>
                                            <button className="delete-btn">
                                                <img src="/assets/images/delete.png" alt="Delete" />
                                            </button>
                                        </div>
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

            </div>
            <style jsx>{`
                .shop-search-bar {
                    visibility: hidden;
                }
            `}</style>
        </div>
    );
}

export default CustomersCard;
