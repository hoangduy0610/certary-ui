import React from 'react';
import { Table, Button, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import './organizations.scss';

interface Organization {
  key: string;
  name: string;
  type: string;
  location: string;
  certificates: number;
  status: 'Active' | 'Pending' | 'Suspended';
}

const data: Organization[] = [
  {
    key: '1',
    name: 'UIT',
    type: 'University',
    location: 'Vietnam',
    certificates: 100,
    status: 'Active',
  },
  {
    key: '2',
    name: 'TechCorp',
    type: 'Company',
    location: 'Singapore',
    certificates: 50,
    status: 'Pending',
  },
  {
    key: '3',
    name: 'NGO Asia',
    type: 'NGO',
    location: 'Thailand',
    certificates: 20,
    status: 'Suspended',
  },
];

const OrganizationsPage: React.FC = () => {
  const getStatusColor = (status: Organization['status']) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Pending':
        return 'orange';
      case 'Suspended':
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
      render: () => <input type="checkbox" />,
      width: 50,
    },
    {
      title: 'Organization',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Certificates',
      dataIndex: 'certificates',
      key: 'certificates',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Organization['status']) => (
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

  return (
    <div className="organizations-page">
      <Row justify="space-between" className="actions-row">
        <Col>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>Add Organization</Button>
        </Col>
      </Row>

      <Table columns={columns} dataSource={data} className="organizations-table" />
    </div>
  );
};

export default OrganizationsPage;
