/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import axios from 'axios'; 
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
      <h1 className="text-center text-3xl font-bold mb-6">Directorates</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[10, 10]}>
          {directorates.map((directorate) => (
            <Col key={directorate.Id} span={8}>
              <Card
                title={directorate.directorateName}
                hoverable
                style={{ backgroundColor: '#eedc82', color: '#753918' }}
              >
                <p>Total Number of Departments: {directorate.departmentsCount}</p>
                {directorate.description && <p>Description: {directorate.description}</p>}
                <Link
                 to={`/departments/${directorate.Id}`}
                 style={{ color: 'black', textDecoration: 'none', fontWeight:'bold' }} 
                >
                 View Departments
               </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DashboardDirectoratesPage;
