import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Space, Table, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import { UpdateUserDto, User, UserAPI } from '../../../services/userAPI';
import FormUser from './FormUser';
import './Users.scss';
import { useUserInfo } from '../../../hooks/useUserInfo';
import organizationsAPI from '../../../services/organizationsAPI';

const Users: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formLoading, setFormLoading] = useState(false);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [invitationForm] = Form.useForm();
  const { userInfo } = useUserInfo();

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

  const handleInviteUser = async () => {
    setShowInviteForm(true);
  }

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

  const handleDeleteUser = async (user: User) => {
    try {
      await UserAPI.delete(user.id);
      messageApi.success('User deleted successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      messageApi.error('Error deleting user');
    }
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
          <Popconfirm
            title="You make sure delete this user? All data will be clean. This action is not reversible."
            onConfirm={() => handleDeleteUser(record)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button variant="outlined" className="ms-2" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
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
              {
                userInfo.role === 'org_manager' && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleInviteUser}>
                    Invite User
                  </Button>
                )}
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

          <Modal
            title="Invite User"
            open={showInviteForm}
            onOk={async () => {
              try {
                const values = await invitationForm.validateFields();
                await organizationsAPI.inviteUser(values.email);
                messageApi.success('Invitation sent successfully');
                setShowInviteForm(false);
                invitationForm.resetFields();
              } catch (error) {
                messageApi.error('Error sending invitation');
              }
            }}
            onCancel={() => setShowInviteForm(false)}
            width={600}
          >
            <Form
              layout="vertical"
              form={invitationForm}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter the email address' }]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Users;
