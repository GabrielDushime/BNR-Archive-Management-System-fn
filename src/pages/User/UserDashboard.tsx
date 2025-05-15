/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';

import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

interface Directorate {
  Id: string; 
  directorateName: string;
  description?: string;
  departmentsCount?: number;
}

const DashboardDirectoratesPage: React.FC = () => {
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchDirectorates = async () => {
      try {
        const response = await axiosInstance.get('/directorates/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const directoratesData = response.data;
        
        const directoratesWithDepartments = await Promise.all(
          directoratesData.map(async (directorate: Directorate) => {
            try {
              const departmentResponse = await axiosInstance.get(
                `/departments/directorate/departments/${directorate.Id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...directorate,
                departmentsCount: departmentResponse.data.length,
              };
            } catch (error) {
              console.error(`Failed to fetch departments for directorate ${directorate.Id}:`, error);
              return {
                ...directorate,
                departmentsCount: 0,
              };
            }
          })
        );
        
        setDirectorates(directoratesWithDepartments);
      } catch (error) {
        console.error('Failed to fetch directorates:', error);
        message.error('Failed to fetch directorates');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDirectorates();
  }, [token]);
  
  return (
    <div className="directorates-page">
      <h1 className="text-center text-3xl font-bold mb-6">User Dashboard</h1>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {directorates.map((directorate) => (
            <Col key={directorate.Id} xs={24} sm={12} lg={8}>
              <Card
                title={directorate.directorateName}
                hoverable
                style={{ backgroundColor: '#eedc82', color: '#753918' }}
                className="directorate-card"
              >
                <p>Total Number of Departments: {directorate.departmentsCount}</p>
                {directorate.description && (
                  <p className="description">Description: {directorate.description}</p>
                )}
                <div className="card-footer">
                  <Link
                    to={`/departments/${directorate.Id}`}
                    className="view-departments-link"
                  >
                    View Departments
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DashboardDirectoratesPage;