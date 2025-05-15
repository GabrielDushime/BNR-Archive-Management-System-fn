/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';

import axiosInstance from '../../utils/axiosConfig';
import { useParams, Link } from 'react-router-dom';

interface Department {
  Id: string;
  departmentName: string;
  description?: string;
  divisionsCount?: number;
  directorateName?: string; 
}

const UserDashboardDepartmentsPage: React.FC = () => {
  const { directorateId } = useParams<{ directorateId: string }>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get(`/departments/directorate/departments/${directorateId}`, {
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
  }, [directorateId, token]);

  return (
    <div className="departments-page">
      <h1 className=" text-3xl font-bold mb-6">Departments in that Directorate</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {departments.map((department) => (
            <Col key={department.Id} span={8}>
              <Card
                title={department.departmentName}
                hoverable
                style={{ backgroundColor: '#eedc82', color: '#753918' }}
              >
                
                {department.directorateName && <p>Directorate: {department.directorateName}</p>}
                <p>Total Number of Divisions: {department.divisionsCount}</p>
                <Link
                 style={{ color: 'black', textDecoration: 'none', fontWeight:'bold' }} 
                 to={`/divisions/${department.Id}`}>
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

export default UserDashboardDepartmentsPage;
