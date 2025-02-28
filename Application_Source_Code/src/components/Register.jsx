

// import React, { useContext } from 'react';
// import { GeneralContext } from '../context/GeneralContext';
// import '../styles/Register.css';
// import { useNavigate } from 'react-router-dom';

// const Register = ({ setIsLogin }) => {
//   const { setUsername, setEmail, setPassword, setUsertype, register } = useContext(GeneralContext);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     await register();
//   };

//   return (
//     <body className='registerPage'>
//       <form className="registrationForm">
//         <h2 className='formTitle'>Register</h2>
//         <div className="formGroup">
//           <input type="text" className="inputField" id="usernameInput" placeholder="Username"
//                  onChange={(e) => setUsername(e.target.value)} />
//           <label htmlFor="usernameInput" className="inputLabel">Username</label>
//         </div>
//         <div className="formGroup">
//           <input type="email" className="inputField" id="emailInput" placeholder="Email address"
//                  onChange={(e) => setEmail(e.target.value)} />
//           <label htmlFor="emailInput" className="inputLabel">Email address</label>
//         </div>
//         <div className="formGroup">
//           <input type="password" className="inputField" id="passwordInput" placeholder="Password"
//                  onChange={(e) => setPassword(e.target.value)} />
//           <label htmlFor="passwordInput" className="inputLabel">Password</label>
//         </div>
//         <select className="inputSelect" id="userTypeSelect" aria-label="User type"
//                 onChange={(e) => setUsertype(e.target.value)}>
//           <option value="">User type</option>
//           <option value="admin">Admin</option>
//           <option value="customer">Customer</option>
//           <option value="flight-operator">Flight Operator</option>
//         </select>
//         <button type="submit" className="submitButton" onClick={() => navigate('/auth')}>Sign up</button>
//         <p className="loginPrompt">Already registered? <span className="loginToggle" onClick={() => setIsLogin(true)}>Login</span></p>
//       </form>
//     </body>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import '../styles/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsLogin }) => {
  const navigate = useNavigate();

  // Local state for user input
  const [formData, setFormData] = useState({
    action: 'register',
    username: '',
    email: '',
    password: '',
    userType: '',
  });

  // API Gateway URL (Replace with your actual endpoint)
  const API_GATEWAY_URL = "https://your-id:.execute-api.us-east-1.amazonaws.com/production/users/register";

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registration successful!");
        navigate('/auth'); // Redirect to login
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className='registerPage'>
      <form className="registrationForm" onSubmit={handleRegister}>
        <h2 className='formTitle'>Register</h2>

        <div className="formGroup">
          <input type="text" className="inputField" name="username" placeholder="Username"
                 onChange={handleChange} required />
          <label className="inputLabel">Username</label>
        </div>

        <div className="formGroup">
          <input type="email" className="inputField" name="email" placeholder="Email address"
                 onChange={handleChange} required />
          <label className="inputLabel">Email address</label>
        </div>

        <div className="formGroup">
          <input type="password" className="inputField" name="password" placeholder="Password"
                 onChange={handleChange} required />
          <label className="inputLabel">Password</label>
        </div>

        <select className="inputSelect" name="userType" onChange={handleChange} required>
          <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="flight-operator">Flight Operator</option>
        </select>

        <button type="submit" className="submitButton">Sign up</button>
        <p className="loginPrompt">Already registered? 
          <span className="loginToggle" onClick={() => setIsLogin(true)}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;
