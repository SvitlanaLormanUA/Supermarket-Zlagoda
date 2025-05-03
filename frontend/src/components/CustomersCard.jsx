import React, { useEffect, useState } from 'react';
import api from '../axios';
import { validateCustomerCard } from '../utils/Validation';
import SearchAndBack from './SearchAndBack';
import CustomersList from './CustomersList';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';
import ControlButtons from './ControlButtons';

function CustomersCard() {
  const [customerCards, setCustomerCards] = useState([]);
  const [filterPercent, setFilterPercent] = useState('');
  const [inactiveCategory, setInactiveCategory] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const customersCardFields = [
    { name: 'card_number', label: 'Card Number', readOnly: true },
    { name: 'cust_surname', label: "Customer's Surname" },
    { name: 'cust_name', label: "Customer's Name" },
    { name: 'cust_patronymic', label: "Customer's Patronymic" },
    { name: 'phone_number', label: 'Phone' },
    { name: 'city', label: 'City' },
    { name: 'street', label: 'Street' },
    { name: 'zip_code', label: 'Zip Code' },
    { name: 'percent', label: 'Percent' },
  ];

  useEffect(() => {
    fetchAllCustomersCards();
  }, []);

  const fetchAllCustomersCards = async () => {
    try {
      const response = await api.get('/customers-card');
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
      setCustomerCards(parsedData || []);
      setNoResultsMessage(''); // Clear message when fetching all customers
    } catch (error) {
      console.error('Error fetching customer cards:', error);
      setCustomerCards([]);
      setNoResultsMessage('Failed to fetch customer cards.');
    }
  };

  const handleFilterByPercent = async () => {
    if (!filterPercent) {
      fetchAllCustomersCards();
      return;
    }
    try {
      const response = await api.get(`/customers-card?percent=${filterPercent}&sort=asc`);
      const parsedBody = JSON.parse(response.data.body);
      const customers = parsedBody.customers || [];
      setCustomerCards(customers);
      setNoResultsMessage(customers.length === 0 ? 'No customers found with the specified percent.' : '');
    } catch (error) {
      console.error('Error filtering customer cards by percent:', error);
      setCustomerCards([]);
      setNoResultsMessage('Failed to filter customer cards.');
    }
  };

  const handleInactiveCustomersFilter = async (categoryName) => {
    if (!categoryName) {
      alert('Please enter a category name');
      return;
    }
  
    try {
      const response = await api.get(`/inactive-category/${encodeURIComponent(categoryName)}`);
      const { status, data, message } = response.data; // Directly access response.data
      console.log('Response data:', response); // Log the entire response data
      if (status === 'success') {
        setCustomerCards(data || []);
        setNoResultsMessage(data.length === 0 ? message || 'No inactive customers found' : '');
      } else {
        setCustomerCards([]);
        
        setNoResultsMessage(message || 'Failed to fetch customers for the specified category.');
      }
    } catch (error) {
      console.error('Error fetching inactive customers:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to fetch customers for the specified category.';
      alert(errorMessage);
      setCustomerCards([]);
      setNoResultsMessage(errorMessage);
    }
  };

  const addCustomer = async (newCustomer) => {
    console.log('Adding customer:', newCustomer);
    try {
      const response = await api.post('/customers-card/new_customer', newCustomer);
      console.log('Backend response:', response.data);
      await fetchAllCustomersCards();
    } catch (error) {
      console.error('Error adding new customer:', error);
      const errorMessage =
        error.response?.data?.body
          ? JSON.parse(error.response.data.body)?.message
          : error.response?.data?.detail || 'Error adding new customer.';
      alert(errorMessage);
    }
  };

  const editCustomer = async (editedData) => {
    if (!validateCustomerCard(editedData)) {
      return;
    }
    try {
      await api.patch(`/customers-card/${editedData.card_number}`, JSON.stringify(editedData));
      await fetchAllCustomersCards();
    } catch (error) {
      console.error('Error editing Customers Card:', error);
      alert(error.response?.data?.detail || 'Error updating Customers Card.');
    }
  };

  const deleteCustomer = async (card_numbers) => {
    try {
      for (const card_number of card_numbers) {
        await api.delete(`/customers-card/${card_number}`);
        setCustomerCards((prevCards) =>
          prevCards.filter((customer) => customer.card_number !== card_number)
        );
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert(error.response?.data?.detail || `Cannot delete customer: ${error.message}`);
    }
  };

  const handleSearch = async (value) => {
    try {
      if (!value || value.trim() === '') {
        fetchAllCustomersCards();
        return;
      }

      let name = '';
      let surname = '';

      const parts = value.trim().split(' ');
      if (parts.length > 0) {
        surname = parts[0];
        name = parts.length > 1 ? parts.slice(1).join(' ') : '';
      }

      const query = new URLSearchParams();
      if (name) query.append('name', name);
      if (surname) query.append('surname', surname);

      const response = await api.get(`/customers-card/search?${query.toString()}`);
      const parsedData = response.data.data ?? JSON.parse(response.data.body).data;

      setCustomerCards(Array.isArray(parsedData) ? parsedData : [parsedData]);
      setNoResultsMessage(
        parsedData && parsedData.length === 0 ? 'No customers found matching the search criteria.' : ''
      );
    } catch (error) {
      console.error('Error searching customer cards:', error);
      setCustomerCards([]);
      setNoResultsMessage('No customer cards found.');
    }
  };

  return (
    <div className="cards-container">
      <div className="searchAndBackSection">
        <SearchAndBack onSearch={handleSearch} />
      </div>

      <ControlButtons
        onAdd={(data) => addCustomer(data)}
        onEdit={(ids) => editCustomer(ids)}
        onDelete={(ids) => deleteCustomer(ids)}
        modalFields={customersCardFields}
        deleteItems={customerCards}
        itemKey={(item) => `${item.card_number} – ${item.cust_surname}`}
        itemIdKey="card_number"
      />
      <div className="f-section">
        <div className="inactive-customers-section">
          <span className="f-label">Inactive customers by category:</span>
          <input
            type="text"
            placeholder="Enter Category Name"
            value={inactiveCategory}
            onChange={(e) => setInactiveCategory(e.target.value)}
          />
          <button onClick={() => handleInactiveCustomersFilter(inactiveCategory)}>
            Search
          </button>
        </div>
        <div className="filter-all-section">
          <span className="filter-label">Filter By Percent:</span>
          <input
            type="number"
            id="percent"
            value={filterPercent}
            onChange={(e) => setFilterPercent(e.target.value)}
            placeholder="Enter percent"
          />
          <button onClick={handleFilterByPercent}>Filter</button>
        </div>
      </div>

      {noResultsMessage && (
        <div className="no-results-message" style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
          {noResultsMessage}
        </div>
      )}

      <CustomersList customerCards={customerCards} />

      <AddItemModal
        fields={customersCardFields}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addCustomer}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={editCustomer}
        fields={customersCardFields}
        items={customerCards}
        itemKey="cust_surname"
        itemIdKey="card_number"
      />

      <DeleteItemModal
        items={customerCards}
        itemKey="cust_surname"
        itemIdKey="card_number"
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={deleteCustomer}
      />
    </div>
  );
}

export default CustomersCard;
