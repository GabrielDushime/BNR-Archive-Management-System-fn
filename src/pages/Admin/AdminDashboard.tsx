/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import axiosInstance from '../../utils/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminStyles/AdminDashboard.css'; 

interface CountsData {
  usersCount: number;
  directoratesCount: number;
  departmentsCount: number;
  divisionsCount: number;
  typesCount: number;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<CountsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          directoratesResponse,
          departmentsResponse,
          divisionsResponse,
          typesResponse,
        ] = await Promise.all([
          axiosInstance.get('/user/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get('/directorates/directorates', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get('/departments/departments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get('/divisions/divisions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get('/types/types', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersCount = usersResponse.data.length;
        const directoratesCount = directoratesResponse.data.length;
        const departmentsCount = departmentsResponse.data.length;
        const divisionsCount = divisionsResponse.data.length;
        const typesCount = typesResponse.data.length;

        setData({
          usersCount,
          directoratesCount,
          departmentsCount,
          divisionsCount,
          typesCount,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Auth"
              style={{ backgroundColor: '#DBA628' }}
              onClick={() => handleCardClick('/admin/users')}
              hoverable
            >
              <p>Total Number of Users: {data?.usersCount}</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Directorates"
              style={{ backgroundColor: '#753918' }}
              onClick={() => handleCardClick('/directorates')}
              hoverable
            >
              <p>Total Number of Directorates: {data?.directoratesCount}</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Departments"
              style={{ backgroundColor: '#eedc82' }}
              onClick={() => handleCardClick('/departments')}
              hoverable
            >
              <p>Total Number of Departments: {data?.departmentsCount}</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Divisions"
              style={{ backgroundColor: '#AB892C' }}
              onClick={() => handleCardClick('/divisions')}
              hoverable
            >
              <p>Total Number of Divisions: {data?.divisionsCount}</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title="Types"
              style={{ backgroundColor: '#89724E' }}
              onClick={() => handleCardClick('/types')}
              hoverable
            >
              <p>Total Number of Types: {data?.typesCount}</p>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminDashboard;