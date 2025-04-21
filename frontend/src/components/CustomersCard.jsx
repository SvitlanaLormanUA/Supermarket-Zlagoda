import React, { useEffect, useState } from 'react';
import api from '../axios';
import SearchAndBack from './SearchAndBack';
import CustomersList from './CustomersList';
import AddItemModal from './AddItemModal';
import EditItemModal from "./EditItemModal";
import DeleteItemModal from "./DeleteItemModal";
import ControlButtons from './ControlButtons';

function CustomersCard() {
  const [customerCards, setCustomerCards] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const customersCardFields = [
    { name: "card_number", label: "Card Number", readOnly: true },
    { name: "cust_surname", label: "Customer's Surname" },
    { name: "cust_name", label: "Customer's Name" },
    { name: "cust_patronymic", label: "Customer's Patronymic" },
    { name: "city", label: "City" },
    { name: "street", label: "Street" },
    { name: "zip_code", label: "Zip Code" },
    { name: "percent", label: "Percent" }
  ];

  useEffect(() => {
    fetchAllCustomersCards();
  }, []);

  const fetchAllCustomersCards = async () => {
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

  const editCustomer = async (editedData) => {
    console.log('Edit Customer');
  };

  const deleteCustomer = async (category_numbers) => {
    console.log('Delete Customer');
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
    } catch (error) {
      console.error('Error searching customer cards:', error);
      setCustomerCards([]);
      alert('No customer cards found.');
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
};

export default CustomersCard;