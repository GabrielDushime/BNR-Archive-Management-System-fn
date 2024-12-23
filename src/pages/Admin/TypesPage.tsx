/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Typography, Popconfirm, Select } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Type {
  Id: string;
  typeName: string;
  divisionName: string;
  docUpload: string[]; 
}

interface Division {
  Id: string;
  divisionName: string;
}

const { Title } = Typography;
const { Option } = Select;

const TypesPage: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentType, setCurrentType] = useState<Type | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [divisionId, setDivisionId] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    setUserRole(role);

    if (role === 'admin' || role === 'user') {
      fetchTypes(token);
      fetchDivisions(token);
    } else {
      notification.error({ message: 'Unauthorized access' });
    }
  }, [divisionId]);

  const fetchTypes = async (token: string | null) => {
    try {
      const response = await axios.get(`http://localhost:8000/types/types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTypes(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to fetch types' });
      }
    }
  };

  const fetchDivisions = async (token: string | null) => {
    try {
      const response = await axios.get('http://localhost:8000/divisions/divisions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDivisions(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch divisions' });
    }
  };

  const handleView = (type: Type) => {
    setCurrentType(type);
    form.setFieldsValue(type);
    setModalMode('view');
    setIsModalVisible(true);
  };

  const handleEdit = (type: Type) => {
    setCurrentType(type);
    form.setFieldsValue(type);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/types/delete/type/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Type deleted successfully' });
      fetchTypes(token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to delete type' });
      }
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { typeName } = values;

      if (!typeName || typeof typeName !== 'string') {
        notification.error({ message: 'Type name is required and must be a string' });
        return;
      }

      await axios.post(
        `http://localhost:8000/types/create/${divisionId}`,
        { typeName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      notification.success({ message: 'Type created successfully' });
      fetchTypes(token);
      setIsCreateModalVisible(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notification.error({ message: `Failed to create type: ${error.response.data.message || 'Unknown error'}` });
      } else {
        notification.error({ message: 'Failed to create type' });
      }
    }
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'edit' && currentType) {
        const values = await form.validateFields();
        await axios.put(`http://localhost:8000/types/update/division/${currentType.Id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notification.success({ message: 'Type updated successfully' });
        fetchTypes(token);
        setIsModalVisible(false);
      }
    } catch (error) {
      notification.error({ message: 'Failed to update type' });
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
      title: 'Type Name',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: 'Division Name',
      dataIndex: 'divisionName',
      key: 'divisionName',
    },
    {
        title: 'Documents',
        dataIndex: 'docUpload',
        key: 'docUpload',
        render: (docUpload: string[]) => docUpload.length,
      },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Type) => (
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
                title="Are you sure to delete this type?"
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
          Add Type
        </Button>
      )}
      <Title level={2}>Types Management</Title>

      <Table columns={columns} dataSource={types} rowKey="Id" scroll={{ x: 'max-content' }} />
      <Modal
        title={modalMode === 'edit' ? 'Edit Type' : modalMode === 'create' ? 'Create Type' : 'View Type'}
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
            name="typeName"
            label="Type Name"
            rules={[{ required: true, message: 'Please input the type name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="divisionName"
            label="Division Name"
            rules={[{ required: true, message: 'Please select the division!' }]}
          >
            <Select placeholder="Select Division" onChange={(value) => setDivisionId(value)}>
              {divisions.map(division => (
                <Option key={division.Id} value={division.Id}>
                  {division.divisionName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TypesPage;
