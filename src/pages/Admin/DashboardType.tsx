/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import axiosInstance from '../../utils/axiosConfig';  

interface Type {
  Id: string;
  typeName: string;
  description?: string;
  documentsCount?: number;
  divisionName?: string; 
}

const DashboardTypesPage: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axiosInstance.get('/types/types', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const typesData = response.data;

        const typesWithDocumentsCount = await Promise.all(
          typesData.map(async (type: Type) => {
            try {
              const documentsResponse = await axiosInstance.get(
                `/documents/type/${type.Id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...type,
                documentsCount: documentsResponse.data.length,
              };
            } catch (error) {
              console.error(`Failed to fetch documents for type ${type.Id}:`, error);
              return {
                ...type,
                documentsCount: 0,
              };
            }
          })
        );

        setTypes(typesWithDocumentsCount);
      } catch (error) {
        console.error('Failed to fetch types:', error);
        message.error('Failed to fetch types');
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [token]);

  return (
    <div className="types-page">
      <h1 className="text-center text-3xl font-bold mb-6">Types</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {types.map((type) => (
            <Col key={type.Id} span={8}>
              <Card
                title={type.typeName}
                hoverable
                style={{ backgroundColor: '#89724E', color: 'white' }}
              >
                <p>Total Number of Documents: {type.documentsCount}</p>
                {type.description && <p>Description: {type.description}</p>}
                <p>Division: {type.divisionName}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default DashboardTypesPage;
