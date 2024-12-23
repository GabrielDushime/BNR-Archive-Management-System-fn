/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Type {
  Id: string;
  typeName: string;
  description?: string;
  documentsCount?: number;
  divisionName?: string; 
}

const UserDashboardTypesPage: React.FC = () => {
  const { divisionId } = useParams<{ divisionId: string }>(); 
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        
        const response = await axios.get(`http://localhost:8000/types/division/types/${divisionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const typesData = response.data;

     
        const typesWithDocumentsCount = await Promise.all(
          typesData.map(async (type: Type) => {
            try {
              const documentsResponse = await axios.get(
                `http://localhost:8000/documents/type/${type.Id}`,
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
  }, [divisionId, token]);

  return (
    <div className="types-page">
      <h1 className=" text-3xl font-bold mb-6">Types in that Division</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {types.length === 0 ? (
            <p>No types found for this division.</p>
          ) : (
            types.map((type) => (
              <Col key={type.Id} span={8}>
                <Card
                  title={type.typeName}
                  hoverable
                  style={{ backgroundColor: '#89724E', color: 'white' }}
                > 
                <p>Division: {type.divisionName}</p>
                  <p>Total Number of Documents: {type.documentsCount}</p>
                  
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default UserDashboardTypesPage;
