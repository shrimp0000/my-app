import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [msg, setMsg] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submission and use JS to handle the submission
    
    // get the input username and password values from the form
    const username = event.target.username.value; // the input field with the name attribute 'username' in the form (event.target)
    const password = event.target.password.value; // the input field with the name attribute 'password' in the form (event.target)

    try {
      // Send POST request with the username and password to the backend
      const response = await axios.post('http://3.145.83.67:8080/api/loggn', {
        username: username,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json' // Ensure JSON format
        },
        withCredentials: true // Use credentials (cookies) to enable session management
      });
  
      // Handle the response
      if (response.data.status === 'success') {
        setMsg(response.data.msg); // Success message
        // console.log(document.cookie);
        // redirect or update state here
        if (document.referrer.includes('/loggn/register')) {
          window.location.href = '/';
          return;
        }
        // window.history.back();
        // await new Promise(resolve => setTimeout(resolve, 2000));
        window.location.href = document.referrer; 
        
      } else {
        setMsg(response.data.msg); // Error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMsg('An error occurred while logging in.');
    }
  };

  return (
    <div className="login-and-register-container">
      <div className="login">
        <h1 className='login-and-register-h1'>Login</h1>
        <div className="links">
          <a href="/loggn" className="active">Login</a>
          <a href="/loggn/register">Register</a>
        </div>
        <form onSubmit={handleLogin}>
          {/* <label htmlFor="username">
            <i className="fas fa-user"></i>
          </label> */}
          <input type="text" name="username" placeholder="Username" id="username" required />
          {/* <label htmlFor="password">
            <i className="fas fa-lock"></i>
          </label> */}
          <input type="password" name="password" placeholder="Password" id="password" required />
          <div className="msg">{msg}</div>
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
}

export default Login;

