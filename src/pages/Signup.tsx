import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/Signup.css'; 
import AdminSidebar from '../components/AdminSidebar';

const { Option } = Select;

const Signup: React.FC = () => {
  const [form] = Form.useForm(); 
  
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('https://bnr-archive-management-system.onrender.com/user/signup', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      toast.success('User created successfully');
      
      console.log(response.data);

      form.resetFields(); 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Signup failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div className="signup-container">
        <h1>Create your Account Here!</h1>
        <Form
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          form={form} 
          className="signup-form"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select a role">
              <Option value="user">user</Option>
              <Option value="admin">admin</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="signup-button">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
