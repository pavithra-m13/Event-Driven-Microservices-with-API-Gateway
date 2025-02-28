import React, { useContext, useState } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { useNavigate } from 'react-router-dom';

const API_GATEWAY_URL = "https://your-id.execute-api.us-east-1.amazonaws.com/production/users/login"; // Replace with actual API Gateway URL

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword } = useContext(GeneralContext);
  const navigate = useNavigate();
  const [email, setLocalEmail] = useState('');
  const [password, setLocalPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await fetch(API_GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data = await response.json();
      alert("Login successful!");
      setEmail(email); // Save user email in context
      setPassword(password);
      navigate('/book-Flight'); // Redirect after successful login

    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <form className="authForm" onSubmit={handleLogin}>
      <h2>Login</h2>

      {error && <p className="errorMessage">{error}</p>}

      <div className="formGroup">
        <input
          type="email"
          className="formControl"
          id="floatingInput"
          placeholder=" " 
          value={email}
          onChange={(e) => setLocalEmail(e.target.value)}
          required
        />
        <label htmlFor="floatingInput" className="labelFloating">Email address</label>
      </div>

      <div className="formGroup">
        <input
          type="password"
          className="formControl"
          id="floatingPassword"
          placeholder=" " 
          value={password}
          onChange={(e) => setLocalPassword(e.target.value)}
          required
        />
        <label htmlFor="floatingPassword" className="labelFloating">Password</label>
      </div>

      <button type="submit" className="authButton">Sign in</button>

      <p>Not registered? <span onClick={() => setIsLogin(false)}>Register</span></p>
    </form>
  );
};

export default Login;
