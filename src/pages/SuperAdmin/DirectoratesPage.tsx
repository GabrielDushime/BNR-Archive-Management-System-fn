/* eslint-disable @typescript-eslint/no-unused-vars */


import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Typography, Popconfirm } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'; 
import axiosInstance from '../../utils/axiosConfig';

interface Directorate {
  Id: string;
  directorateName: string;
  description: string;
 
}


const { Title } = Typography;

const SuperAdminDirectoratesPage: React.FC = () => {
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDirectorate, setCurrentDirectorate] = useState<Directorate | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    setUserRole(role);

    if (role === 'admin' || role === 'super-admin') {
      fetchDirectorates(token);
    } else {
      notification.error({ message: 'Unauthorized access' });
    }
  }, []);

  const fetchDirectorates = async (token: string | null) => {
    try {
      const response = await axiosInstance.get('/directorates/directorates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDirectorates(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to fetch directorates' });
      }
    }
  };

  const handleView = (directorate: Directorate) => {
    setCurrentDirectorate(directorate);
    form.setFieldsValue(directorate);
    setModalMode('view');
    setIsModalVisible(true);
  };

  const handleEdit = (directorate: Directorate) => {
    setCurrentDirectorate(directorate);
    form.setFieldsValue(directorate);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/directorates/delete/directorate/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Directorate deleted successfully' });
      fetchDirectorates(token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to delete directorate' });
      }
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      await axiosInstance.post('/directorates/create', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Directorate created successfully' });
      fetchDirectorates(token);
      setIsCreateModalVisible(false);
    } catch (error) {
      notification.error({ message: 'Failed to create directorate' });
    }
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'edit' && currentDirectorate) {
        const values = await form.validateFields();
        await axiosInstance.put(`/directorates/update/directorate/${currentDirectorate.Id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notification.success({ message: 'Directorate updated successfully' });
        fetchDirectorates(token);
        setIsModalVisible(false);
      } else {
        setIsModalVisible(false);
      }
    } catch (error) {
      notification.error({ message: 'Failed to update directorate' });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCreateModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Directorate Name',
      dataIndex: 'directorateName',
      key: 'directorateName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
   
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Directorate) => (
        <span>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          {userRole === 'admin' && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                style={{ margin: '0 8px' }}
              />
              <Popconfirm
                title="Are you sure to delete this directorate?"
                onConfirm={() => handleDelete(record.Id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </>
          )}
        </span>
      ),
    },
  ];

  return (
    <div>
      {userRole === 'admin' && (
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsCreateModalVisible(true); 
            setModalMode('create'); 
            form.resetFields();
          }}
          style={{ marginBottom: '16px', float: 'right', backgroundColor: '#753918' }}
        >
          Add Directorate
        </Button>
      )}
      <Title level={2}>Directorates Management</Title>
      <Table columns={columns} dataSource={directorates} rowKey="Id" scroll={{ x: 'max-content' }} />
      <Modal
        title={modalMode === 'edit' ? 'Edit Directorate' : modalMode === 'create' ? 'Create Directorate' : 'View Directorate'}
        visible={isModalVisible || isCreateModalVisible} 
        onOk={modalMode === 'create' ? handleCreate : handleOk}
        
        onCancel={handleCancel}
        okText={modalMode === 'edit' ? 'Save' : modalMode === 'create' ? 'Create' : 'Close'}
        cancelText="Cancel"
        okButtonProps={{
          style: { backgroundColor: '#753918' },
        }}
        cancelButtonProps={{
          style: { backgroundColor: '#f0f0f0', borderColor: '#d9d9d9', color: '#000' }, 
        }}

      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="directorateName"
            label="Directorate Name"
            rules={[{ required: true, message: 'Please input the directorate name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuperAdminDirectoratesPage;
