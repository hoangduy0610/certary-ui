import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import forumAPI, { ForumCategory } from '../../../services/forumAPI';
import FormForumCategory from './FormForumCategory';
import './ForumCategory.scss';
import { IconDisplay } from '../../../components/IconPicker/IconPicker';
import IconType from '@ant-design/icons/lib/components/Icon';

const ForumCategoryPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formLoading, setFormLoading] = useState(false);
  const [forumCategoryFormVisible, setForumCategoryFormVisible] = useState(false);
  const [editingForumCategory, setEditingForumCategory] = useState<ForumCategory | null>(null);
  const [forumCategoriesData, setForumCategoriesData] = useState<ForumCategory[]>([]);

  const fetchForumCategories = async () => {
    const response = await forumAPI.getAllCategories();
    setForumCategoriesData(response);
  }

  useEffect(() => {
    fetchForumCategories();
  }, [])

  const handleCreateForumCategory = () => {
    setEditingForumCategory(null);
    setForumCategoryFormVisible(true);
  };

  const handleCancelFormForumCategory = () => {
    setForumCategoryFormVisible(false);
    setEditingForumCategory(null);
  };

  const handleSubmitFormForumCategory = async (values: Partial<ForumCategory>) => {
    try {
      if (editingForumCategory) {
        setFormLoading(true);
        // Update existing forumCategory
        await forumAPI.updateCategory(editingForumCategory.id, values);
        messageApi.success('ForumCategory updated successfully');
      } else {
        // Create new forumCategory
        await forumAPI.createCategory(values);
        messageApi.success('ForumCategory created successfully');
      }
      setFormLoading(false);
      setForumCategoryFormVisible(false);
      setEditingForumCategory(null);
      fetchForumCategories(); // Refresh the forumCategory list
    } catch (error) {
      messageApi.error('Error saving forumCategory data');
    }
  };

  const handleEditForumCategory = (forumCategory: ForumCategory) => {
    setEditingForumCategory(forumCategory);
    setForumCategoryFormVisible(true);
  }

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 50,
      key: 'icon',
      render: (icon: string) => (
        <IconDisplay icon={icon} style={{ fontSize: 20 }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ForumCategory) => (
        <Space size="middle">
          <Button variant="outlined" color="primary" onClick={() => {
            handleEditForumCategory(record);
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
      <div className="forum-categories-page">
        {/* Header */}
        <AdminHeader />
        <div className="admin-wrapper">
          <Row justify="space-between" className="forum-categories-actions">
            <Col>
              <Space>
                {/* <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<ExportOutlined />}>Export</Button> */}
              </Space>
            </Col>
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateForumCategory}>
                Add Category
              </Button>
            </Col>
          </Row>

          <Table
            className="forum-categories-table"
            columns={columns}
            dataSource={forumCategoriesData}
            pagination={{ pageSize: 5 }}
          />

          <FormForumCategory
            showModal={forumCategoryFormVisible}
            initialValues={editingForumCategory}
            onCancel={handleCancelFormForumCategory}
            onSubmit={handleSubmitFormForumCategory}
            loading={formLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ForumCategoryPage;
