/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

interface Department {
  Id: string;
  departmentName: string;
  description?: string;
  divisionsCount?: number;
  directorateName?: string;
}

const DashboardDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/departments/departments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const departmentsData = response.data;
        
        const departmentsWithDivisions = await Promise.all(
          departmentsData.map(async (department: Department) => {
            try {
              const divisionResponse = await axiosInstance.get(
                `/divisions/department/division/${department.Id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...department,
                divisionsCount: divisionResponse.data.length,
              };
            } catch (error) {
              console.error(`Failed to fetch divisions for department ${department.Id}:`, error);
              return {
                ...department,
                divisionsCount: 0,
              };
            }
          })
        );
        
        setDepartments(departmentsWithDivisions);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        message.error('Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, [token]);
  
  return (
    <div className="departments-page">
      <h1 className="page-title">Departments From All Directorates</h1>
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {departments.map((department) => (
            <Col 
              key={department.Id} 
              xs={24}     /* Full width on extra small screens (mobile) */
              sm={12}     /* Half width on small screens (tablets) */
              md={8}      /* One-third width on medium screens */
              lg={8}      /* One-third width on large screens */
              xl={6}      /* One-fourth width on extra large screens */
            >
              <Card
                title={department.departmentName}
                hoverable
                className="department-card"
                style={{ backgroundColor: '#eedc82', color: '#753918' }}
              >
                <p>Total Number of Divisions: {department.divisionsCount}</p>
                {department.directorateName && <p>Directorate: {department.directorateName}</p>}
                <Link
                  className="view-divisions-link"
                  style={{ color: 'black', textDecoration: 'none', fontWeight:'bold' }}
                  to={`/divisions/${department.Id}`}
                >
                  View Divisions
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DashboardDepartmentsPage;