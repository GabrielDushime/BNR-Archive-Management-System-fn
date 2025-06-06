/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import axiosInstance from '../../utils/axiosConfig'; 
import { Link } from 'react-router-dom';


interface Division {
  Id: string;
  divisionName: string;
  description?: string;
  typesCount?: number;
  departmentName?: string; 
}

const DashboardDivisionsPage: React.FC = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axiosInstance.get('/divisions/divisions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const divisionsData = response.data;

        const divisionsWithTypes = await Promise.all(
          divisionsData.map(async (division: Division) => {
            try {
              const typeResponse = await axiosInstance.get(
                `/types/division/types/${division.Id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...division,
                typesCount: typeResponse.data.length,
              };
            } catch (error) {
              console.error(`Failed to fetch types for division ${division.Id}:`, error);
              return {
                ...division,
                typesCount: 0,
              };
            }
          })
        );

        setDivisions(divisionsWithTypes);
      } catch (error) {
        console.error('Failed to fetch divisions:', error);
        message.error('Failed to fetch divisions');
      } finally {
        setLoading(false);
      }
    };

    fetchDivisions();
  }, [token]);

  return (
    <div className="divisions-page">
      <h1 className="text-center text-3xl font-bold mb-6">Divisions</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {divisions.map((division) => (
            <Col key={division.Id} span={8}>
              <Card
                title={division.divisionName}
                hoverable
                style={{ backgroundColor: '#AB892C', color: '#753918' }}
              >
                <p>Total Number of Types: {division.typesCount}</p>
                {division.description && <p>Description: {division.description}</p>}
                {division.departmentName && <p>Department: {division.departmentName}</p>}
                <Link 
                 style={{ color: 'black', textDecoration: 'none', fontWeight:'bold' }} 
                to={`/types/${division.Id}`}>View Types
                    
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DashboardDivisionsPage;
