import { Button, Col, Image, Row, Space, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import forumAPI, { ForumCategory, ForumPost } from '../../../services/forumAPI';
import './ForumPost.scss';

const ForumPostPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // const [formLoading, setFormLoading] = useState(false);
  // const [forumPostFormVisible, setForumPostFormVisible] = useState(false);
  const [forumPostsData, setForumPostsData] = useState<ForumPost[]>([]);

  const fetchForumPosts = async () => {
    const response = await forumAPI.getAllPosts();
    setForumPostsData(response);
  }

  useEffect(() => {
    fetchForumPosts();
  }, [])

  const handleTogglePinPost = async (post: ForumPost) => {
    try {
      await forumAPI.togglePinPost(post.id);
      messageApi.success(`Post ${post.isPinned ? 'unpinned' : 'pinned'} successfully`);
      fetchForumPosts(); // Refresh the post list
    } catch (error) {
      messageApi.error('Error toggling pin status');
    }
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: ForumCategory) => (
        <span>{category.name}</span>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author: any) => (
        <div>
          <Image
            width={30}
            height={30}
            src={author.avatar || 'https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small_2x/default-avatar-photo-placeholder-profile-picture-vector.jpg'}
            alt={author.name}
            style={{ borderRadius: '50%' }}
          />
          <span className="ms-2">{author.name}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ForumPost) => (
        <Space size="middle">
          <Button variant="outlined" className="ms-2" danger onClick={() => {
            handleTogglePinPost(record);
          }}>
            {record.isPinned ? 'Unpin' : 'Pin'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="forum-post-page">
        {/* Header */}
        <AdminHeader />
        <div className="admin-wrapper">
          <Row justify="space-between" className="forum-post-actions">
            <Col>
              <Space>
                {/* <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<ExportOutlined />}>Export</Button> */}
              </Space>
            </Col>
            <Col>
              {/* <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateForumPost}>
                Add Post
              </Button> */}
            </Col>
          </Row>

          <Table
            className="forum-post-table"
            columns={columns}
            dataSource={forumPostsData}
            pagination={{ pageSize: 5 }}
          />

          {/* <FormForumPost
            showModal={forumPostFormVisible}
            initialValues={editingForumPost}
            onCancel={handleCancelFormForumPost}
            onSubmit={handleSubmitFormForumPost}
            loading={formLoading}
          /> */}
        </div>
      </div>
    </>
  );
};

export default ForumPostPage;
