import React, { useEffect, useState } from 'react';
import SearchAndBack from './SearchAndBack';
import CustomersList from './CustomersList';

function CustomersCard() {
    const [customerCards, setCustomerCards] = useState([]);

    useEffect(() => {
        fetchAllCustomersCards();
    }, []);

    const fetchAllCustomersCards = () => {
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
    };

    const handleSearch = (searchParams) => {  
        if (!searchParams || searchParams.trim() === '') {
            fetchAllCustomersCards();
            return;
        }
    
        let name = '';
        let surname = '';
    
        if (typeof searchParams === 'string') {
            const parts = searchParams.trim().split(' ');
            if (parts.length > 0) {
                surname = parts[0];
                name = parts.length > 1 ? parts.slice(1).join(' ') : '';
            }
        } else if (typeof searchParams === 'object') {
            ({ name, surname } = searchParams);
        }
    
        const query = new URLSearchParams();
        if (name) query.append('name', name);
        if (surname) query.append('surname', surname);
    
        fetch(`http://127.0.0.1:5174/customers-card/search?${query.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                const parsedData = JSON.parse(data.body).data;
                setCustomerCards(parsedData || []);
            })
            .catch((error) => {
                console.error('Error searching customer cards:', error);
                setCustomerCards([]);
            });
    };

    const addCustomer = (newCustomer) => {
        setCustomerCards([...customerCards, newCustomer]);
    };

    return (
        <div>
            <div className="cards-container">
                <div className="searchAndBackSection">
                    <SearchAndBack onSearch={handleSearch} />
                </div>
                <CustomersList customerCards={customerCards} addCustomer={addCustomer} />
            </div>
        </div>
    );
}

export default CustomersCard;