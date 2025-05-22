import React, { useState } from 'react';
import { Table, Button, Space, Tag, Row, Col, Avatar, Badge, Input } from 'antd';
import { FilterOutlined, ExportOutlined, PlusOutlined, CheckCircleOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';
import './Certificates.scss';
import { Header } from 'antd/es/layout/layout';
import AdminHeader from '../../../components/Admin Header/adminHeader';

interface Certificate {
  key: string;
  id: string;
  title: string;
  recipient: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expired' | 'Revoked';
}

const data: Certificate[] = [
  {
    key: '1',
    id: 'CERT001',
    title: 'Blockchain Basics',
    recipient: 'Alice',
    issuer: 'UIT',
    issueDate: '2024-01-01',
    expiryDate: '2026-01-01',
    status: 'Valid',
  },
  {
    key: '2',
    id: 'CERT002',
    title: 'AI Foundations',
    recipient: 'Bob',
    issuer: 'UIT',
    issueDate: '2023-05-20',
    expiryDate: '2025-05-20',
    status: 'Expired',
  },
  {
    key: '3',
    id: 'CERT003',
    title: 'Data Privacy',
    recipient: 'Charlie',
    issuer: 'TechCorp',
    issueDate: '2022-08-15',
    expiryDate: '2024-08-15',
    status: 'Revoked',
  },
];

const CertificatesPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const getStatusColor = (status: Certificate['status']) => {
    switch (status) {
      case 'Valid':
        return 'green';
      case 'Expired':
        return 'orange';
      case 'Revoked':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: () => null,
      width: 50,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Issuer',
      dataIndex: 'issuer',
      key: 'issuer',
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Certificate['status']) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a className="delete-action">Delete</a>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="certificates-page">
      {/* Header */}
      <AdminHeader />
      <Row justify="space-between" className="actions-row">
        <Col>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button icon={<CheckCircleOutlined />} disabled={selectedRowKeys.length === 0}>
              Verify
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Certificate
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        className="certificates-table"
      />
    </div>
  );
};

export default CertificatesPage;
