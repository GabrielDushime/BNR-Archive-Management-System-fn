import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Select, Upload, notification } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import '../styles/UserDocuments.css';

const { Option } = Select;

interface Document {
  Id: string;
  docName: string;
  docDescription: string;
  fileUrl: string;
  userEmail: string;
  userId: string;
  categoryId: number;
}

interface Category {
  Id: number;
  categoryName: string;
}

const UserDocumentsPage: React.FC = () => {
  const [userdocuments, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [, setSelectedRowId] = useState<string | null>(null);

  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let response;
        if (userRole === 'user') {
          response = await axios.get('https://bnr-archive-management-system.onrender.com/document/user/documents', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (response && response.data) {
          console.log('Fetched Documents:', response.data); 
          setDocuments(response.data);
        } else {
          notification.error({ message: 'No document found' });
        }
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://bnr-archive-management-system.onrender.com/categories/cats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response && response.data) {
          console.log('Fetched Categories:', response.data); 
          setCategories(response.data);
        } else {
          notification.error({ message: 'No categories found' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to fetch categories' });
      }
    };

    fetchDocuments();
    fetchCategories();
  }, [userRole, token]);

  const handleUpdate = async (values: any) => {
    if (!selectedDocument) {
      notification.error({ message: 'No document selected for update' });
      return;
    }

    try {
      const { docName, docDescription } = values;
      await axios.put(`https://bnr-archive-management-system.onrender.com/document/${selectedDocument.Id}`, 
        { docName, docDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notification.success({ message: 'Document Updated  successfully' });
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.Id === selectedDocument.Id ? { ...doc, docName, docDescription } : doc
        )
      );
      setSelectedDocument(null);
      setIsModalVisible(false);
    } catch (error) {
      toast.error('Failed to update document');
    }
  };



  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === '') {
        try {
          const response = await axios.get('https://bnr-archive-management-system.onrender.com/document/user/documents', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setDocuments(response.data);
          setSelectedRowId(null);
        } catch (error) {
          notification.error({ message: 'Failed to fetch documents' });
        }
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`https://bnr-archive-management-system.onrender.com/document/search`, {
          params: { name: searchTerm },
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response && response.data) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          const filteredDocuments = response.data.filter((doc: Document) =>
            doc.docName.toLowerCase().startsWith(lowerSearchTerm)
          );

          setDocuments(filteredDocuments);

          if (filteredDocuments.length > 0) {
            setSelectedRowId(filteredDocuments[0].Id);
            
          } else {
            setSelectedRowId(null);
            notification.error({ message: 'No documents found with that name' });
          }
        } else {
          setDocuments([]);
          setSelectedRowId(null);
          notification.error({ message: 'No documents found' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to search documents' });
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [searchTerm, token]);


  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting document with ID: ${id}`); 
      await axios.delete(`https://bnr-archive-management-system.onrender.com/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notification.success({ message: 'Document deleted successfully' });
      setDocuments((prev) => prev.filter((doc) => doc.Id !== id));
    } catch (error) {
      notification.error({ message: 'Failed to delete the document' });
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await axios.get(`https://bnr-archive-management-system.onrender.com/document/download/${id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      
      const contentType = response.headers['content-type'];
      const extension = contentType.split('/')[1]; 
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition?.match(/filename="(.+?)"/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `document_${id}.${extension}`;
  
     
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      notification.error({ message: 'Failed to download the document' });
    }
  };
  
  

  const handleAddDocument = async (values: any) => {
    const { categoryName } = values;
    const category = categories.find((cat) => cat.categoryName === categoryName);
    if (!category) {
      notification.error({ message: 'Category not found' });
      return;
    }

    const formData = new FormData();
    formData.append('docName', values.docName);
    formData.append('docDescription', values.docDescription);
    formData.append('categoryId', category.Id.toString());
    fileList.forEach(file => formData.append('files', file.originFileObj));

    try {
      const response = await axios.post('https://bnr-archive-management-system.onrender.com/document/add/' + category.Id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
     
      notification.success({ message: 'Document Added successfully' });
     
      setDocuments((prev) => [...prev, { ...values, docId: response.data.docId }]); 
      setIsModalVisible(false);
      setFileList([]);
    } catch (error) {
      notification.error({ message: 'Failed to Add Document' });
    }
  };

  const handleFileChange = ({ fileList }: any) => setFileList(fileList);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id'
    },
    {
      title: 'Document Name',
      dataIndex: 'docName',
      key: 'docName'
    },
    {
      title: 'Description',
      dataIndex: 'docDescription',
      key: 'docDescription'
    },
    {
      title: 'File URL',
      dataIndex: 'fileUrl',
      key: 'fileUrl'
    },
    {
      title: 'User Id',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <div style={{ whiteSpace: 'nowrap' }}>
          <Button onClick={() => handleDownload(record.Id)} style={{ marginRight: 8 }}>Download</Button>
          <Button
            onClick={() => {
              setSelectedDocument(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this document?"
            onConfirm={() => handleDelete(record.Id)}
          >
            <Button danger >Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button className='document-button'
      type="primary" 
      icon={<PlusOutlined />}
      onClick={() => setIsModalVisible(true)}
      style={{ marginBottom: '16px', float:'right', backgroundColor:'#800000' }}
      >  Add Document
      </Button>
      <div className="search-bar focus:border-[#800000]"  style={{  float: 'right',  borderColor: '#800000', color: '#FFFFFF',width:200 }}>
        <Input
          type="text"
          placeholder="Search Document......"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Title level={2}>Documents Management</Title>
      <Table
        dataSource={userdocuments}
        columns={columns}
        loading={loading}
        rowKey="Id"
        scroll={{ x: 'max-content' }}
      />
      
     
      <Modal
        title={selectedDocument ? 'Update Document' : 'Add Document'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedDocument(null);
          form.resetFields();
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              if (selectedDocument) {
                handleUpdate(values);
              } else {
                handleAddDocument(values);
              }
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form form={form} layout="vertical" initialValues={selectedDocument || {}}>
          <Form.Item label="Document Name" name="docName" rules={[{ required: true, message: 'Please enter the document name' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="docDescription" rules={[{ required: true, message: 'Please enter the document description' }]}>
            <Input.TextArea />
          </Form.Item>
          {!selectedDocument && (
            <>
              <Form.Item label="File" name="file" rules={[{ required: true, message: 'Please upload a file' }]}>
                <Upload
                  listType="text"
                  multiple={false}
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleFileChange}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Category" name="categoryName" rules={[{ required: true, message: 'Please select a category' }]}>
                <Select>
                  {categories.map((category) => (
                    <Option key={category.Id} value={category.categoryName}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserDocumentsPage;