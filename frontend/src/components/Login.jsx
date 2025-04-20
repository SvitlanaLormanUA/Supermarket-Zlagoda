import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5174/login', {
        email,
        password,
      });

      const token = response.data.access_token;
      
      // через 7 днів -- він вже всьо
      Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'Strict' });

      const userResponse = await axios.get('http://localhost:5174/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userRole = userResponse.data; // e.g., "Manager"
      Cookies.set('user_role', userRole, { expires: 7, secure: true, sameSite: 'Strict' });

      onLogin(userRole);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid login or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLoginClick}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-button" type="submit">
            Log In
          </button>
          <button className="forgot-password" type="button">
            Forgot Password?
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;