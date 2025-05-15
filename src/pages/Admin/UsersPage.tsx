/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, Typography, notification, Spin } from 'antd';

import axiosInstance from '../../utils/axiosConfig';
import { ColumnsType } from 'antd/es/table';
import { getTokenFromLocalStorage } from '../../utils/auth';

interface User {
  Id: string;
  firstName: string;
  lastName: string;
  email: string;
  Role: string;
  directorateIds?: string[];
}

interface Directorate {
  Id: string;
  directorateName: string;
}

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState(false); 
  const [form] = Form.useForm();

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        fetchUsers(token);
        fetchDirectorates(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        notification.error({ message: 'Failed to decode token' });
      }
    }
  }, []);

  const fetchUsers = async (token: string) => {
    try {
      const response = await axiosInstance.get('/user/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      notification.error({ message: 'Failed to fetch users' });
    }
  };

  const fetchDirectorates = async (token: string) => {
    try {
      const response = await axiosInstance.get('/directorates/directorates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDirectorates(response.data);
    } catch (error) {
      console.error('Error fetching directorates:', error);
      notification.error({ message: 'Failed to fetch directorates' });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      Role: user.Role,
      directorates: user.directorateIds || [],
    });
    setIsModalVisible(true);
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setIsViewModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      console.error('No token found.');
      return;
    }

    try {
      await axiosInstance.delete(`/user/Delete/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({ message: 'User deleted successfully' });
      fetchUsers(token);
    } catch (error) {
      console.error('Error deleting user:', error);
      notification.error({ message: 'Failed to delete user' });
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true); 
    if (editingUser) {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('No token found.');
        setLoading(false); 
        return;
      }

      const payload = {
        ...values,
        directorateIds: values.directorates, 
      };

      try {
        const response = await axiosInstance.put(`/user/update/user/${editingUser.Id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Update response:', response.data); 
        notification.success({ message: 'User updated successfully' });
        setIsModalVisible(false);
        setEditingUser(null);
        fetchUsers(token);
      } catch (error: any) {
        console.error('Error updating user:', error.response?.data || error.message);
        notification.error({ message: 'Failed to update user' });
      } finally {
        setLoading(false); 
      }
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
    },
    {
      title: 'Directorates',
      dataIndex: 'directorates',
      key: 'directorates',
      render: (directorates: Directorate[]) => (
        <span>{directorates.map(d => d.directorateName).join(', ')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: User) => (
        <div>
          <Button onClick={() => handleView(record)} style={{ marginRight: 8 }}>View</Button>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Users Management</Title>
      <Table 
        dataSource={users}
        columns={columns}
        rowKey="Id"
        scroll={{ x: 'max-content' }}
      />

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Spin spinning={loading}> 
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Role" label="Role" rules={[{ required: true, message: 'Please input the role!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="directorates" label="Directorates">
              <Select
                mode="multiple"
                placeholder="Select directorates"
                options={directorates.map(d => ({
                  value: d.Id,
                  label: d.directorateName,
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}> 
                Save
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      {/* View User Modal */}
      <Modal
        title="Users Credentials"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {viewingUser && (
          <div>
            <p><strong>First Name:</strong> {viewingUser.firstName}</p>
            <p><strong>Last Name:</strong> {viewingUser.lastName}</p>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Role:</strong> {viewingUser.Role}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;
