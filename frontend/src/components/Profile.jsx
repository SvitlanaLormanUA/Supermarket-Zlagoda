import api from '../axios';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await api.get('/users/me');
        const parsedData = response.data.data ?? JSON.parse(response.data.body).data;
        setUserData(parsedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  const fieldLabels = {
    employee_id: 'Employee ID',
    email: 'Email',
    is_active: 'Active Status',
    role: 'Account Role',
    employee_role: 'Employee Role',
    account_role: 'Account Role',
    surname: 'Surname',
    name: 'Name',
    patronymic: 'Patronymic',
    salary: 'Salary',
    date_of_birth: 'Date of Birth',
    date_of_start: 'Start Date',
    phone_number: 'Phone Number',
    id_employee: 'Employee ID',
    empl_surname: 'Surname',
    empl_name: 'Name',
    empl_patronymic: 'Patronymic',
    empl_role: 'Employee Role'
  };

  if (isLoading) {
    return <div className="profile-container loading">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  // Prepare combined address
  const address = [userData.city, userData.street, userData.zip_code]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="profile-container">
      <h1 className="profile-title">
        Hello, {userData.empl_name || 'User'}!
      </h1>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Profile Info</h2>
          </div>

          <div className="profile-details">
            <p>
              <strong>Full Name:</strong> {userData.empl_name || ''} {userData.empl_surname || ''} {userData.patronymic || ''}
            </p>
            <p>
              <strong>Position:</strong> {userData.empl_role || 'N/A'}
            </p>

            {address && (
              <p>
                <strong>Address:</strong> {address}
              </p>
            )}

            {Object.entries(userData)
              .filter(
                ([key]) =>
                  ![
                    'account_id',
                    'id_employee',
                    'empl_surname',
                    'empl_name',
                    'empl_patronymic',
                    'empl_role',
                    'salary',
                    'street',
                    'city',
                    'zip_code'
                  ].includes(key.toLowerCase())
              )
              .map(([key, value]) => {
                const formattedKey =
                  fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <p key={key}>
                    <strong>{formattedKey}:</strong>{' '}
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                  </p>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
