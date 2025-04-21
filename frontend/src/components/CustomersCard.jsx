import React, { useEffect, useState } from 'react';
import api from '../axios'; 
import SearchAndBack from './SearchAndBack';
import CustomersList from './CustomersList';

function CustomersCard() {
  const [customerCards, setCustomerCards] = useState([]);

  useEffect(() => {
    const fetchCustomerCards = async () => {
      try {
        const response = await api.get('/customers-card');
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        setCustomerCards(parsedData || []);
      } catch (error) {
        console.error('Error fetching customer cards:', error);
        setCustomerCards([]);
        alert('Failed to fetch customer cards.');
      }
    };
    fetchCustomerCards();
  }, []);

  const addCustomer = async (newCustomer) => {
    try {
      await api.post('/customers-card/new_customer', newCustomer);
      const response = await api.get('/customers-card');
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setCustomerCards(parsedData || []);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert(error.response?.data?.detail || 'Error adding customer.');
    }
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