import { DeleteOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import { UpdateUserDto, User, UserAPI } from '../../../services/userAPI';
import './Users.scss';
import FormUser from './FormUser';

const Users: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formLoading, setFormLoading] = useState(false);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [usersData, setUsersData] = useState<User[]>([]);

  const getRoleColor = (status: User['role']) => {
    switch (status) {
      case 'admin':
        return 'red';
      case 'org_manager':
        return 'blue';
      case 'org_staff':
        return 'green';
      case 'user':
        return 'purple';
      default:
        return 'default';
    }
  };

  const fetchUsers = async () => {
    const response = await UserAPI.getAll();
    setUsersData(response);
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  const handleCreateUser = () => {
    // setEditingUser(null);
    // setUserFormVisible(true);
  };

  const handleCancelFormUser = () => {
    setUserFormVisible(false);
    setEditingUser(null);
  };

  const handleSubmitFormUser = async (values: UpdateUserDto) => {
    try {
      if (editingUser) {
        setFormLoading(true);
        // Update existing user
        await UserAPI.update(editingUser.id, values);
        messageApi.success('User updated successfully');
      } else {
        // Create new user
        // await UserAPI.create(values);
      }
      setFormLoading(false);
      setUserFormVisible(false);
      setEditingUser(null);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      messageApi.error('Error saving user data');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormVisible(true);
  }

  const columns = [
    {
      title: '',
      dataIndex: 'select',
      key: 'select',
      width: 50,
      render: () => <input type="checkbox" />,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Wallet Address',
      dataIndex: 'walletAddress',
      key: 'walletAddress',
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
      render: (role: User['role']) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button variant="outlined" color="primary" onClick={() => {
            handleEditUser(record);
          }}>
            <EditOutlined />
          </Button>
          <Button variant="outlined" className="ms-2" danger onClick={() => { }}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="users-page">
        {/* Header */}
        <AdminHeader />
        <div className="admin-wrapper">
          <Row justify="space-between" className="users-actions">
            <Col>
              <Space>
                {/* <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<ExportOutlined />}>Export</Button> */}
              </Space>
            </Col>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
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

          <FormUser
            showModal={userFormVisible}
            initialValues={editingUser}
            onCancel={handleCancelFormUser}
            onSubmit={handleSubmitFormUser}
            loading={formLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Users;
