import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, message, Popconfirm, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import './CertificateType.scss';
import { CertificateType, CertificateTypeAPI } from '../../../services/certificateTypeAPI';
import FormCertificateType from './FormCertificateType';

const CertificateTypePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CertificateType[]>([]);
  const [selectedType, setSelectedType] = useState<CertificateType | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchTypes = async () => {
    try {
      const result = await CertificateTypeAPI.getAll();
      setData(result);
    } catch (error) {
      messageApi.error('Failed to fetch certificate types');
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAdd = () => {
    setSelectedType(null);
    setFormVisible(true);
  };

  const handleEdit = (type: CertificateType) => {
    setSelectedType(type);
    setFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await CertificateTypeAPI.delete(id);
      messageApi.success('Deleted successfully');
      fetchTypes();
    } catch {
      messageApi.error('Delete failed');
    }
  };

  const handleFormSubmit = async (values: Partial<CertificateType>) => {
    setLoading(true);
    try {
      if (selectedType) {
        await CertificateTypeAPI.update(selectedType.id, values);
        messageApi.success('Updated successfully');
      } else {
        // Ensure required fields are present before creating
        if (!values.name) {
          messageApi.error('Name and Code are required');
          setLoading(false);
          return;
        }
        await CertificateTypeAPI.create(values as any);
        messageApi.success('Created successfully');
      }
      setFormVisible(false);
      fetchTypes();
    } catch {
      messageApi.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) =>
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CertificateType) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this type?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      {contextHolder}
      <div className="certificate-type-page">
        <AdminHeader />
        <div className="admin-wrapper">
          <Row justify="end" className="actions-row">
            <Col>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Add Type
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            className="certificate-type-table"
          />
          <FormCertificateType
            visible={formVisible}
            onCancel={() => setFormVisible(false)}
            onSubmit={handleFormSubmit}
            initialValues={selectedType}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default CertificateTypePage;
