import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Typography, notification } from 'antd';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';
import { getTokenFromLocalStorage, getRoleFromToken } from '../utils/auth';

interface User {
  Id: string;
  firstName: string;
  lastName: string;
  email: string;
  Role: string;
}

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        const role = getRoleFromToken(token);
        fetchUsers(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        notification.error({ message: 'Failed to decode token' });
      }
    }
  }, []);

  const fetchUsers = async (token: string) => {
    try {
      const response = await axios.get('https://bnr-archive-management-system.onrender.com/user/users', {
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

  const handleEdit = (user: User) => {
    setEditingUser(user);
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
      await axios.delete(`https://bnr-archive-management-system.onrender.com/user/Delete/user/${userId}`, {
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
    if (editingUser) {
      const token = getTokenFromLocalStorage();
      if (!token) {
        console.error('No token found.');
        return;
      }

      try {
        await axios.put(`https://bnr-archive-management-system.onrender.com/user/update/user/${editingUser.Id}`, values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notification.success({ message: 'User updated successfully' });
        setIsModalVisible(false);
        setEditingUser(null);
        fetchUsers(token);
      } catch (error) {
        console.error('Error updating user:', error);
        notification.error({ message: 'Failed to update user' });
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
        <Form
          layout="vertical"
          initialValues={editingUser || {}}
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
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
