/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Typography, Popconfirm, Select } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios'; 
import axiosInstance from '../../utils/axiosConfig';

interface Division {
  Id: string;
  divisionName: string;
  departmentName: string;
}

interface Department {
  Id: string;
  departmentName: string;
}

const { Title } = Typography;
const { Option } = Select;

const SuperAdminDivisionsPage: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    setUserRole(role);

    if (role === 'admin' || role === 'super-admin') {
      fetchDivisions(token);
      fetchDepartments(token);
    } else {
      notification.error({ message: 'Unauthorized access' });
    }
  }, []);

  const fetchDivisions = async (token: string | null) => {
    try {
      const response = await axiosInstance.get('/divisions/divisions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDivisions(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to fetch divisions' });
      }
    }
  };

  const fetchDepartments = async (token: string | null) => {
    try {
      const response = await axiosInstance.get('/departments/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch departments' });
    }
  };

  const handleView = (division: Division) => {
    setCurrentDivision(division);
    form.setFieldsValue(division);
    setModalMode('view');
    setIsModalVisible(true);
  };

  const handleEdit = (division: Division) => {
    setCurrentDivision(division);
    form.setFieldsValue(division);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.delete(`/divisions/delete/division/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Division deleted successfully' });
      fetchDivisions(token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to delete division' });
      }
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { divisionName, departmentName } = values;

      if (!divisionName || typeof divisionName !== 'string') {
        notification.error({ message: 'Division name is required and must be a string' });
        return;
      }

      const selectedDepartment = departments.find(department => department.departmentName === departmentName);
      if (!selectedDepartment) {
        notification.error({ message: 'Department not found' });
        return;
      }

      await axiosInstance.post(
        `/divisions/create/${selectedDepartment.Id}`,
        { divisionName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      notification.success({ message: 'Division created successfully' });
      fetchDivisions(token);
      setIsCreateModalVisible(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notification.error({ message: `Failed to create division: ${error.response.data.message || 'Unknown error'}` });
      } else {
        notification.error({ message: 'Failed to create division' });
      }
    }
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'edit' && currentDivision) {
        const values = await form.validateFields();
        await axiosInstance.put(`/divisions/update/division/${currentDivision.Id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notification.success({ message: 'Division updated successfully' });
        fetchDivisions(token);
        setIsModalVisible(false);
      }
    } catch (error) {
      notification.error({ message: 'Failed to update division' });
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
      title: 'Division Name',
      dataIndex: 'divisionName',
      key: 'divisionName',
    },
    {
      title: 'Department Name',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Division) => (
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
                title="Are you sure to delete this division?"
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
          Add Division
        </Button>
      )}
      <Title level={2}>Divisions Management</Title>

      <Table columns={columns} dataSource={divisions} rowKey="Id" scroll={{ x: 'max-content' }} />
      <Modal
        title={modalMode === 'edit' ? 'Edit Division' : modalMode === 'create' ? 'Create Division' : 'View Division'}
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
            name="divisionName"
            label="Division Name"
            rules={[{ required: true, message: 'Please input the division name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="departmentName"
            label="Department Name"
            rules={[{ required: true, message: 'Please select the department!' }]}
          >
            <Select placeholder="Select Department">
              {departments.map(department => (
                <Option key={department.Id} value={department.departmentName}>
                  {department.departmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuperAdminDivisionsPage;
