import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, notification, Typography, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Category {
  Id: string;
  categoryName: string;
  description: string;
  docUpload: string[]; 
}

const { Title } = Typography;

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); 
  const [form] = Form.useForm();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view'); 

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    setUserRole(role);

    if (role === 'admin') {
      fetchCategories(token);
    } else {
      notification.error({ message: 'Unauthorized access' });
    }
  }, []);

  const fetchCategories = async (token: string | null) => {
    try {
      const response = await axios.get('https://bnr-archive-management-system.onrender.com/categories/cats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to fetch categories' });
      }
    }
  };

  const handleView = (category: Category) => {
    setCurrentCategory(category);
    form.setFieldsValue(category);
    setModalMode('view');
    setIsModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    form.setFieldsValue(category);
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://bnr-archive-management-system.onrender.com/categories/delete/cat/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Category deleted successfully' });
      fetchCategories(token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        notification.error({ message: 'Access forbidden. You do not have the required permissions.' });
      } else {
        notification.error({ message: 'Failed to delete category' });
      }
    }
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    try {
      const values = await form.validateFields();
      await axios.post('https://bnr-archive-management-system.onrender.com/categories/create', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Category created successfully' });
      fetchCategories(token);
      setIsCreateModalVisible(false);
    } catch (error) {
      notification.error({ message: 'Failed to create category' });
    }
  };

  const handleOk = async () => {
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'edit' && currentCategory) {
        const values = await form.validateFields();
        await axios.put(`https://bnr-archive-management-system.onrender.com/categories/update/cat/${currentCategory.Id}`, values, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notification.success({ message: 'Category updated successfully' });
        fetchCategories(token);
        setIsModalVisible(false);
      } else {
        setIsModalVisible(false);
      }
    } catch (error) {
      notification.error({ message: 'Failed to update category' });
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
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Documents',
      dataIndex: 'docUpload',
      key: 'docUpload',
      render: (docUpload: string[]) => (
        <div>
          {docUpload.length > 0 ? docUpload.join(', ') : 'No documents'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: Category) => (
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
                title="Are you sure to delete this category?"
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
          style={{ marginBottom: '16px',float:'right', backgroundColor:'#800000' }}
        >
          Add Category
        </Button>
      )}
      <Title level={2}>Categories Management</Title>
     
      <Table columns={columns} dataSource={categories} rowKey="Id" scroll={{ x: 'max-content' }} />
      <Modal
        title={modalMode === 'edit' ? 'Edit Category' : modalMode === 'create' ? 'Create Category' : 'View Category'}
        visible={isModalVisible || isCreateModalVisible} 
        onOk={modalMode === 'create' ? handleCreate : handleOk}
        onCancel={handleCancel}
        okText={modalMode === 'edit' ? 'Save' : modalMode === 'create' ? 'Create' : 'Close'}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
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

export default CategoriesPage;
