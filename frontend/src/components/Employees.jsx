import React, { useState, useEffect } from 'react';
import api from '../axios';
import { validateEmployee, validateUniqueField } from '../utils/Validation';
import SearchAndBack from './SearchAndBack';
import ControlButtons from './ControlButtons';
import CustomTable from './CustomTable';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';

const RoleOptions = [
    { value: 'Cashier', label: 'Cashier' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Security Guard', label: 'Security Guard' },
    { value: 'Cleaner', label: 'Cleaner' },
    { value: 'Loader', label: 'Loader' },
    { value: 'Administrator', label: 'Administrator' }
];

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [filterCashiers, setFilterCashiers] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const employeesFields = [
        { name: 'id_employee', label: 'ID Employee', readOnly: true },
        { name: 'empl_surname', label: "Employee's Surname" },
        { name: 'empl_name', label: "Employee's Name", type: 'text' },
        { name: 'empl_patronymic', label: "Employee's Patronymic" },
        { name: 'empl_role', label: 'Role', type: 'fk', options: RoleOptions },
        { name: 'salary', label: 'Salary' },
        { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
        { name: 'date_of_start', label: 'Date of Start', type: 'date' },
        { name: 'phone_number', label: 'Phone' },
        { name: 'city', label: 'City' },
        { name: 'street', label: 'Street' },
        { name: 'zip_code', label: 'Zip Code' }
    ];

    useEffect(() => {
        fetchAllEmployees();
    }, []);

    const fetchAllEmployees = async () => {
        try {
            const response = await api.get('/employees');
            const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
            setEmployees(parsedData || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]);
            alert('Failed to fetch employees.');
        }
    };

    const handleSearch = async (surname) => {

    };

    const filterEmployees = (filterCashiers) => {
        if (filterCashiers) {
            setEmployees((prevEmployees) =>
                prevEmployees.filter((emp) => emp.empl_role === 'Cashier')
            );
        } else {
            fetchAllEmployees();
        }
    };

    const handleFilterChange = () => {
        const newValue = !filterCashiers;
        setFilterCashiers(newValue);
        filterEmployees(newValue);
    };

    const addEmployee = async (newEmployee) => {
        if (!validateEmployee(newEmployee) ||
            !validateUniqueField(newEmployee, employees, 'id_employee')) {
            return;
        }
        try {
            const response = await api.post('/employees/new_employee', newEmployee);
            await fetchAllEmployees();
        } catch (error) {
            console.error('Error adding new employee:', error);
            const errorMessage =
                error.response?.data?.body
                    ? JSON.parse(error.response.data.body)?.message
                    : error.response?.data?.detail || 'Error adding new employee.';
            alert(errorMessage);
        }
    };

    const editEmployee = async (editedData) => {
        if (!validateEmployee(editedData)) {
            return;
        }
        try {
            await api.patch(`/employees/${editedData.id_employee}`, JSON.stringify(editedData));
            await fetchAllEmployees();
        } catch (error) {
            console.error('Error editing employee:', error);
            alert(error.response?.data?.detail || 'Error updating employee.');
        }
    };

    const deleteEmployee = async (id_employees) => {
        try {
            for (const id_employee of id_employees) {
                await api.delete(`/employees/${id_employee}`);
                setEmployees((prevEmpl) =>
                    prevEmpl.filter((employee) => employee.id_employee !== id_employee)
                );
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert(error.response?.data?.detail || `Cannot delete employee: ${error.message}`);
        }
    };

    return (
        <div className="employee-container">
            <div className="searchAndBackSection">
                <SearchAndBack onSearch={handleSearch} />
            </div>

            <ControlButtons
                onAdd={(data) => addEmployee(data)}
                onEdit={(ids) => editEmployee(ids)}
                onDelete={(ids) => deleteEmployee(ids)}
                modalFields={employeesFields}
                deleteItems={employees}
                itemKey={(item) => `${item.id_employee} – ${item.empl_surname}`}
                itemIdKey="id_employee"
            />

            <div className="filter-section">
                <span className="filter-label">Filter:</span>
                <label>
                    <input
                        type="checkbox"
                        checked={filterCashiers}
                        onChange={handleFilterChange}
                    />
                    Only Cashiers
                </label>
            </div>

            <AddItemModal
                fields={employeesFields}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={addEmployee}
            />

            <EditItemModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={editEmployee}
                fields={employeesFields}
                items={employees}
                itemKey="empl_surname"
                itemIdKey="id_employee"
            />

            <DeleteItemModal
                items={employees}
                itemKey="empl_surname"
                itemIdKey="id_employee"
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={deleteEmployee}
            />

            <CustomTable
                data={employees}
                title="Employees"
                columns={[{ key: 'empl_surname', label: 'Employees' }]}
            />
            <style jsx>{`
                .back-button {
                visibility: hidden;
                }
            `}</style>
        </div>
    );
}

export default Employees;