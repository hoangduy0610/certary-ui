import React, { useState } from 'react';
import { Table, Button, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, FilterOutlined, ExportOutlined } from '@ant-design/icons';
import './Users.scss';
import AdminHeader from '../../../components/Admin Header/adminHeader';


interface User {
  key: string;
  name: string;
  email: string;
  role: string;
  certificates: number;
  status: 'Active' | 'Inactive' | 'Banned';
}

const usersData: User[] = [
  {
    key: '1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'Admin',
    certificates: 5,
    status: 'Active',
  },
  {
    key: '2',
    name: 'Bob',
    email: 'bob@example.com',
    role: 'User',
    certificates: 2,
    status: 'Inactive',
  },
  {
    key: '3',
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'User',
    certificates: 3,
    status: 'Banned',
  },
];

const Users: React.FC = () => {
  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'orange';
      case 'Banned':
        return 'red';
      default:
        return 'default';
    }
  };


  const columns = [
    {
      title: '',
      dataIndex: 'select',
      key: 'select',
      width: 50,
      render: () => <input type="checkbox" />,
    },
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
      render: (status: User['status']) => (
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
    <div className="users-page">
      {/* Header */}
      <AdminHeader />
      <Row justify="space-between" className="users-actions">
        <Col>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </Col>
      </Row>

      <Table
        className="users-table"
        columns={columns}
        dataSource={usersData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Users;
