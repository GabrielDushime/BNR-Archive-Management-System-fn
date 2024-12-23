/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Typography, Popconfirm, Select } from 'antd';
import {  EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Department {
  Id: string;
  departmentName: string;
  directorateName: string;
 /*  docUpload: string[]; */
}

interface Directorate {
  Id: string;
  directorateName: string;
}

const { Title } = Typography;
const { Option } = Select;

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    setUserRole(role);

    if (role === 'admin' || role==='user') {
      fetchDepartments(token);
      fetchDirectorates(token);
    } else {
      notification.error({ message: 'Unauthorized access' });
    }
  }, []);

  const fetchDepartments = async (token: string | null) => {
    try {
      const response = await axios.get('http://localhost:8000/departments/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to fetch departments' });
      }
    }
  };

  const fetchDirectorates = async (token: string | null) => {
    try {
      const response = await axios.get('http://localhost:8000/directorates/directorates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDirectorates(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch directorates' });
    }
  };

  const handleView = (department: Department) => {
    setCurrentDepartment(department);
    form.setFieldsValue(department);
    setModalMode('view');
    setIsModalVisible(true);
  };

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department);
    form.setFieldsValue(department);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/departments/delete/department/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Department deleted successfully' });
      fetchDepartments(token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to delete department' });
      }
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      const { departmentName, directorateName } = values;

      if (!departmentName || typeof departmentName !== 'string') {
        notification.error({ message: 'Department name is required and must be a string' });
        return;
      }

      const selectedDirectorate = directorates.find(directorate => directorate.directorateName === directorateName);
      if (!selectedDirectorate) {
        notification.error({ message: 'Directorate not found' });
        return;
      }

      await axios.post(
        `http://localhost:8000/departments/create/${selectedDirectorate.Id}`,
        { departmentName }, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      notification.success({ message: 'Department created successfully' });
      fetchDepartments(token); 
      setIsCreateModalVisible(false); 
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notification.error({ message: `Failed to create department: ${error.response.data.message || 'Unknown error'}` });
      } else {
        notification.error({ message: 'Failed to create department' });
      }
    }
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'edit' && currentDepartment) {
        const values = await form.validateFields();
        await axios.put(`http://localhost:8000/departments/update/department/${currentDepartment.Id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notification.success({ message: 'Department updated successfully' });
        fetchDepartments(token);
        setIsModalVisible(false);
      }
    } catch (error) {
      notification.error({ message: 'Failed to update department' });
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
      title: 'Department Name',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: 'Directorate Name',
      dataIndex: 'directorateName',
      key: 'directorateName',
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Department) => (
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
                title="Are you sure to delete this department?"
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
          Add Department
        </Button>
      )}
      <Title level={2}>Departments Management</Title>

      <Table columns={columns} dataSource={departments} rowKey="Id" scroll={{ x: 'max-content' }} />
      <Modal
        title={modalMode === 'edit' ? 'Edit Department' : modalMode === 'create' ? 'Create Department' : 'View Department'}
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
            name="departmentName"
            label="Department Name"
            rules={[{ required: true, message: 'Please input the department name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="directorateName"
            label="Directorate Name"
            rules={[{ required: true, message: 'Please select the directorate!' }]}
          >
            <Select placeholder="Select Directorate">
              {directorates.map(directorate => (
                <Option key={directorate.Id} value={directorate.directorateName}>
                  {directorate.directorateName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
