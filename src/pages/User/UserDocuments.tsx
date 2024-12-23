/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Modal, Form, Input, Select, Upload, notification } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UploadOutlined,EditOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import '../../styles/UserStyles/UserDocuments.css';


const { Option } = Select;

interface Document {
  Id: string;
  referenceId:string;
  docName: string;
  docDescription: string;
  fileUrl: string;
  userEmail: string;
  userId: string;
  directorateName: string;
  departmentName: string;
  divisionName: string;
  typeName:string;
 

}

interface Directorate {
  Id: string;
  directorateName: string;
}

interface Department {
  Id: string;
  departmentName: string;
  directorateName: string;
}
interface Division{
  Id: string;
  divisionName:string;
  departmentName: string;
}
interface Type{

  Id: string;
  typeName:string;
  divisionName:string;


}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchRefId, setSearchRefId] = useState('');
  const [, setSelectedRowId] = useState<string | null>(null);

  const [selectedDirectorate, setSelectedDirectorate] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [filteredDivisions, setFilteredDivisions] = useState<Division[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<Type[]>([]);

  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        let response;
        if (userRole === 'admin' || userRole === 'user') {
          response = await axios.get('http://localhost:8000/document/user/documents', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        if (response && response.data) {
          console.log('Fetched Documents:', response.data); 
          setDocuments(response.data);
        }
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };


    const fetchDirectorates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/directorates/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response && response.data) {
          console.log('Fetched Directorates:', response.data); 
          setDirectorates(response.data);
        } else {
          notification.error({ message: 'No directorates found' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to fetch directorates' });
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/departments/departments', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response && response.data) {
          console.log('Fetched Departments:', response.data); 
          setDepartments(response.data);
        } else {
          notification.error({ message: 'No departments found' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to fetch departments' });
      }
    };
    const fetchDivisions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/divisions/divisions', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response && response.data) {
          console.log('Fetched Divisions:', response.data); 
          setDivisions(response.data);
        } else {
          notification.error({ message: 'No division found' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to fetch divisions' });
      }
    };
    const fetchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/types/types', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response && response.data) {
          console.log('Fetched Types:', response.data); 
          setTypes(response.data);
        } else {
          notification.error({ message: 'No type found' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to fetch types' });
      }
    };

    fetchDocuments();
    fetchDirectorates();
    fetchDepartments();
    fetchDivisions();
    fetchTypes();
  }, [userRole, token]);

  useEffect(() => {
    if (selectedDirectorate) {
      const filtered = departments.filter(dept => dept.directorateName === selectedDirectorate);
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedDirectorate, departments]);
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = divisions.filter(div => div.departmentName === selectedDepartment);
      setFilteredDivisions(filtered);
    } else {
      setFilteredDivisions([]);
    }
  }, [selectedDepartment, divisions]);

  useEffect(() => {
    if (selectedDivision) {
      const filtered = types.filter(type => type.divisionName === selectedDivision);
      setFilteredTypes(filtered);
    } else {
      setFilteredTypes([]);
    }
  }, [selectedDivision, types]);
  

  const handleUpdate = async (values: any) => {
    if (!selectedDocument) {
      notification.error({ message: 'No document selected for update' });
      return;
    }

    try {
      const { docName, docDescription, departmentName } = values;
      await axios.put(`http://localhost:8000/document/${selectedDocument.Id}`, 
        { docName, docDescription, departmentName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notification.success({ message: 'Document Updated successfully' });
     
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.Id === selectedDocument.Id ? { ...doc, docName, docDescription, departmentName } : doc
        )
      );
      setSelectedDocument(null);
      setIsModalVisible(false);
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting document with ID: ${id}`); 
      await axios.delete(`http://localhost:8000/document/${id}`, {
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
      const response = await axios.get(`http://localhost:8000/document/download/${id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const contentType = response.headers['content-type'];
      const contentDisposition = response.headers['content-disposition'];
      const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `document_${id}.${contentType.split('/')[1]}`;
  
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
  
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error('Failed to download the document:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        notification.error({ message: 'Failed to download the document' });
      } else {
        notification.error({ message: 'An unexpected error occurred while downloading the document.' });
      }
    }
  };
  
  useEffect(() => {
   
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      try {
        const response = await axios.get('http://localhost:8000/document/user/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(response.data);
        setSelectedRowId(null);
      } catch (error) {
        
      }
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/document/search', {
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

useEffect(() => {
  const handleSearchByRefId = async () => {
    if (searchRefId.trim() === '') {
      try {
        const response = await axios.get('http://localhost:8000/document/user/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(response.data);
      } catch (error) {
      
      }
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/document/search/referenceId', {
        params: { referenceId: searchRefId },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length === 0) {
        notification.warning({ message: 'No results found' });
      } else {
        setDocuments(response.data);
      }
    } catch (error) {
      notification.error({ message: 'No Document with that reference ID' });
    } finally {
      setLoading(false);
    }
  };

  handleSearchByRefId();
}, [searchRefId, token]);

  const handleAddDocument = async (values: any) => {
    const { departmentName, directorateName,divisionName,typeName } = values;
  
    const directorate = directorates.find((dir) => dir.directorateName === directorateName);
    const department = filteredDepartments.find((dept) => dept.departmentName === departmentName);
    const division = filteredDivisions.find((div)=>div.divisionName === divisionName);
    const type = filteredTypes.find ((type)=>type.typeName === typeName)    
  
    if (!department) {
      notification.error({ message: 'Department not found' });
      return;
    }
  
    if (!directorate) {
      notification.error({ message: 'Directorate not found' });
      return;
    }
    if (!division) {
      notification.error({ message: 'Division not found' });
      return;
    }
    if (!type) {
      notification.error({ message: 'Type not found' });
      return;
    }
  
    const formData = new FormData();
    formData.append('docName', values.docName);
    formData.append('docDescription', values.docDescription);
    fileList.forEach((file) => formData.append('file', file));
  
    try {
      await axios.post(
        `http://localhost:8000/document/add/${directorate.Id}/${department.Id}/${division.Id}/${type.Id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      notification.success({ message: 'Document added successfully' });
    
      const newDocument: Document = {
        Id: '', 
        referenceId:'',
        docName: values.docName,
        docDescription: values.docDescription,
        fileUrl: '',
        userEmail: '', 
        userId: '', 
       
        directorateName,
        departmentName,
        divisionName,
        typeName,
        
        
 
      };
  
      setDocuments((prev) => [...prev, newDocument]);
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      notification.error({ message: 'Failed to add document' });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Reference ID',
      dataIndex: 'referenceId',
      key: 'referenceId',
    },

    {
      title: 'Document Name',
      dataIndex: 'docName',
      key: 'docName',
    },
    {
      title: 'Description',
      dataIndex: 'docDescription',
      key: 'docDescription',
    },
    { 
      title: 'Directorate Name',
       dataIndex: 'directorateName',
        key: 'directorateName'
    },

    {
       title: 'Department Name',
       dataIndex: 'departmentName',
       key: 'departmentName'
    }, 
    
    {
      title: 'Division Name',
      dataIndex: 'divisionName',
      key: 'divisionName'
   }, 
   {
    title: 'Type Name',
    dataIndex: 'typeName',
    key: 'typeName'
 }, 

    { 
      title: 'File URL', 
      dataIndex: 'fileUrl',
       key: 'fileUrl', 
       render: (text: string) => <a href={text} 
       target="_blank" rel="noopener noreferrer">
        View File</a> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <span>
           <Button   style={{ margin: '0 8px' }}
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.Id)}
          />
          <Button   style={{ margin: '0 8px' }}
            icon={<EditOutlined />}
            onClick={() => { setSelectedDocument(record); setIsModalVisible(true); }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Yes"
            cancelText="No"
          >
             <Button danger   style={{ margin: '0 8px' }}>Delete</Button>
          </Popconfirm>
         
        </span>
      ),
    },
  ];

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList((prevFileList) => {
        const index = prevFileList.indexOf(file);
        const newFileList = prevFileList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file: any) => {
      setFileList((prevFileList) => [...prevFileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
         <div className="search-add-container">
        <div className="search-bar">
          <Input
            placeholder="Search Doc by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="search-bar1">
        <Input
          placeholder="Search documents by reference ID"
          value={searchRefId}
          onChange={(e) => setSearchRefId(e.target.value)}
          
        />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: '16px', float: 'right', backgroundColor: '#753918' }}
          onClick={() => { setIsModalVisible(true); setSelectedDocument(null); }}
          className="add-document-button"
        >
          Add Document
        </Button>
      </div>
      <Title level={2} className="title">Documents Management</Title>
   
      <Table
        columns={columns}
        dataSource={documents}
        rowKey="Id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={selectedDocument ? 'Update Document' : 'Add Document'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
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
        okText={selectedDocument ? 'Update' : 'Add'}
        okButtonProps={{
          style: { backgroundColor: '#753918' },
        }}
        cancelButtonProps={{
          style: { backgroundColor: '#f0f0f0', borderColor: '#d9d9d9', color: '#000' }, 
        }}
      >
        <Form form={form} layout="vertical" initialValues={selectedDocument || {}} className="form">
          <Form.Item
            name="docName"
            label="Document Name"
            rules={[{ required: true, message: 'Please enter the document name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="docDescription"
            label="Document Description"
            rules={[{ required: true, message: 'Please enter the document description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="directorateName"
            label="Directorate"
            rules={[{ required: true, message: 'Please select a directorate!' }]}
          >
            <Select
              onChange={(value) => setSelectedDirectorate(value)}
              placeholder="Select Directorate"
            >
              {directorates.map(directorate => (
                <Option key={directorate.Id} value={directorate.directorateName}>
                  {directorate.directorateName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="departmentName"
            label="Department"
            rules={[{ required: true, message: 'Please select a department!' }]}
          >
            <Select
              onChange={(value) => setSelectedDepartment(value)}
              placeholder="Select Department"
            >
              {filteredDepartments.map(department => (
                <Option key={department.Id} value={department.departmentName}>
                  {department.departmentName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="divisionName"
            label="Division"
            rules={[{ required: true, message: 'Please select a division!' }]}
          >
            <Select
              onChange={(value) => setSelectedDivision(value)}
              placeholder="Select Division"
            >
              {filteredDivisions.map(division => (
                <Option key={division.Id} value={division.divisionName}>
                  {division.divisionName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="typeName"
            label="Type"
            rules={[{ required: true, message: 'Please select a type!' }]}
          >
            <Select placeholder="Select Type">
              {filteredTypes.map(type => (
                <Option key={type.Id} value={type.typeName}>
                  {type.typeName}
                </Option>
              ))}
            </Select>
          </Form.Item>


          <Form.Item label="File Upload">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentsPage;
