import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import CustomersList from './CustomersList';

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
    
    const addCustomer = (newCustomer) => {
        setCustomerCards([...customerCards, newCustomer]);
    };

    return (
        <div>
            <div className="cards-container">
                <div className="searchAndBackSection">
                    <SearchAndBack />
                </div>
                <CustomersList customerCards={customerCards} addCustomer={addCustomer} />
            </div>
        </div>
    );
}

export default CustomersCard;