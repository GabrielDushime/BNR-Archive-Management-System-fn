import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import '../styles/AdminDashboard.css';

interface CountsData {
  usersCount: number;
  categoriesCount: number;
  documentsCount: number;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<CountsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, categoriesResponse, documentsResponse] = await Promise.all([
          axios.get('https://bnr-archive-management-system.onrender.com/user/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://bnr-archive-management-system.onrender.com/categories/cats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('https://bnr-archive-management-system.onrender.com/document/documents', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const usersCount = usersResponse.data.length;
        const categoriesCount = categoriesResponse.data.length;
        const documentsCount = documentsResponse.data.length;

        setData({ usersCount, categoriesCount, documentsCount });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const columns = [
    {
      title: 'Total Number Of Users',
      dataIndex: 'usersCount',
      key: 'usersCount',
    },
    {
      title: 'Total Number Of Categories',
      dataIndex: 'categoriesCount',
      key: 'categoriesCount',
    },
    {
      title: 'Total Number Documents',
      dataIndex: 'documentsCount',
      key: 'documentsCount',
    },
  ];

  const tableData = data ? [data] : [];

  return (
    <div className="admin-dashboard">
      <h1>Welcome to Admin Dashboard!</h1>
      <Table
        columns={columns}
        dataSource={tableData}
        loading={loading}
        pagination={false}
        rowKey={() => 'admin-dashboard'}
      />
    </div>
  );
};

export default AdminDashboard;
