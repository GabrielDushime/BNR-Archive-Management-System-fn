import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext'; 
import '../styles/Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('https://bnr-archive-management-system.onrender.com/auth/signin', values);
      const { token, user } = response.data;
  
      console.log(response.data);
  
     
      if (typeof token === 'object') {
        
        const { access_token } = token;
        localStorage.setItem('token', access_token);
      } else {
        
        localStorage.setItem('token', token);
      }
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.Role);
  
      login(user.Role);
  
      toast.success('Login successful!');
  
      // Redirect based on user role
      if (user.Role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.Role === 'user') {
        navigate('/user/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoginError(error.response?.data?.message || 'Sign in failed');
        toast.error(error.response?.data?.message || 'Sign in failed');
      } else {
        setLoginError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    }
  };
  

  return (
    <div className="login-container">
      <h1>Login Here!</h1>
      <div className="login-page">
       <img src="/images/login.jpeg" alt="Welcome" />
      <Form name="login" layout="vertical" onFinish={onFinish} className="login-form">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Login
          </Button>
        </Form.Item>
      </Form>
      {loginError && <p className="error-message">{loginError}</p>}
      <ToastContainer /> {/* Add ToastContainer to your component */}
    </div>
    </div>
  );
};

export default Login;