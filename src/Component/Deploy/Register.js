import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [msg, setMsg] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent the default form submission and use JS to handle the submission
    
    // get the input username and password values from the form
    const username = event.target.username.value; // the input field with the name attribute 'username' in the form (event.target)
    const password = event.target.password.value; // the input field with the name attribute 'password' in the form (event.target)

    try {
      // Send POST request with the username and password to the backend
      const response = await axios.post('http://18.224.62.233:8080/api/loggn/register', {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json' // Ensure JSON format
        }
        // withCredentials: true // Use credentials (cookies) to enable session management
      });
  
      // Handle the response
      if (response.data.status === 'success') {
        setMsg(response.data.msg); // Success message
        // Optionally, redirect or update state here
      } else {
        setMsg(response.data.msg); // Error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMsg('An error occurred while logging in.');
    }
  };

  return (
    <div className='login-and-register-container'>
      <div className="register">
        <h1 className='login-and-register-h1'>Register</h1>
        <div className="links">
          <a href="/loggn">Login</a>
          <a href="/loggn/register" className="active">Register</a>
        </div>
        <form onSubmit={handleRegister}>
          {/* <label htmlFor="username">
          <i className="fas fa-user"></i>
          </label> */}
          <input type="text" name="username" placeholder="Username" id="username" required />
          {/* <label htmlFor="password">
          <i className="fas fa-lock"></i>
          </label> */}
          <input type="password" name="password" placeholder="Password" id="password" required />
          <div className="msg">{msg}</div>
          <input type="submit" value="Register" />
        </form>
      </div>
    </div>
  );
}

export default Register;