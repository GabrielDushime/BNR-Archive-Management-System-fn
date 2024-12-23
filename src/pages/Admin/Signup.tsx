/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../../styles/AdminStyles/Signup.css'; 
import AdminSidebar from '../../components/Admin components/AdminSidebar';

const { Option } = Select;

const Signup: React.FC = () => {
  const [form] = Form.useForm();
  const [directorates, setDirectorates] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
 
    const fetchDirectorates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/directorates/directorates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDirectorates(response.data);
      } catch (error) {
        toast.error('Failed to load directorates');
      }
    };

    fetchDirectorates();
  }, [token]);

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:8000/user/signup', {
        ...values,
        directorateIds: values.directorateIds || [], 
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('User created successfully');
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
        <h1>Create New Account Here!</h1>
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
            name="Role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select a role">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="super-admin">super-admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Directorates"
            name="directorateIds"
            rules={[{ required: true, message: 'Please select at least one directorate!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select directorates"
            >
              {directorates.map((directorate: any) => (
                <Option key={directorate.Id} value={directorate.Id}>
                  {directorate.directorateName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit"  className="login-button">
              Create Account
            </Button>
          </Form.Item>
        </Form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
