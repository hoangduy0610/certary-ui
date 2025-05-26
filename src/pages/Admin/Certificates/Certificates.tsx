import { CheckCircleOutlined, DeleteOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import { Certificate, CertificateAPI, CreateCertificateDto } from '../../../services/certificateAPI';
import './Certificates.scss';
import FormCertificate from './FormCertificate';
import { render } from '@testing-library/react';
import { Organization } from '../../../services/organizationsAPI';
import moment from 'moment';
import { User } from '../../../services/userAPI';

const CertificatesPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formLoading, setFormLoading] = useState(false);
  const [certificateFormVisible, setCertificateFormVisible] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [data, setData] = useState<Certificate[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const navigate = useNavigate();

  const fetchCertificates = async () => {
    const response = await CertificateAPI.getAll();
    setData(response);
  }

  useEffect(() => {
    fetchCertificates();
  }, [])

  const handleCreateCertificate = () => {
    setEditingCertificate(null);
    setCertificateFormVisible(true);
  };

  const handleCancelFormCertificate = () => {
    setCertificateFormVisible(false);
    setEditingCertificate(null);
  };

  const handleSubmitFormCertificate = async (values: CreateCertificateDto) => {
    try {
      setFormLoading(true);
      if (editingCertificate) {
        // Update existing Certificate
        await CertificateAPI.update(editingCertificate.id, values);
        messageApi.success('Certificate updated successfully');
      } else {
        // Create new certificate
        await CertificateAPI.create(values);
      }
      setFormLoading(false);
      setCertificateFormVisible(false);
      setEditingCertificate(null);
      fetchCertificates(); // Refresh the certificate list
    } catch (error) {
      messageApi.error('Error saving certificate data');
    }
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setCertificateFormVisible(true);
  }

  const mapStatusColor = (status: string): string => {
    switch (status) {
      case 'draft':
        return 'blue';
      case 'waiting_for_id':
        return 'orange';
      case 'issued':
        return 'green';
      case 'claimed':
        return 'purple';
      case 'revoked':
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
      title: 'Token ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Recipient',
      dataIndex: 'recipientEmail',
      key: 'recipientEmail',
    },
    {
      title: 'Ownership',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner: User) => {
        return <Tag color={owner ? 'green' : 'red'}>{owner ? `${owner.firstName} ${owner.lastName}` : "NOT CLAIMED"}</Tag>;
      }
    },
    {
      title: 'Issuer',
      dataIndex: 'issuer',
      key: 'issuer',
      render: (issuer: Organization) => {
        return issuer.name || "Unknown Issuer";
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          draft: 'Draft',
          waiting_for_id: 'Waiting for ID',
          issued: 'Issued',
          claimed: 'Claimed',
          revoked: 'Revoked'
        };
        return <Tag color={mapStatusColor(status)}>
          {statusMap[status] || 'Unknown Status'}
        </Tag>;
      }
    },
    {
      title: 'Issue Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => {
        return moment(date).format('YYYY-MM-DD');
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (_: any, record: Certificate) => {
        return moment(record.createdAt).add(2, 'year').format('YYYY-MM-DD');
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Certificate) => (
        <Space size="middle">
          <Button variant="outlined" color="primary" onClick={() => {
            handleEditCertificate(record);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleVerify = () => {
    if (selectedRowKeys.length === 1) {
      const certId = data.find(cert => cert.id === selectedRowKeys[0])?.id;
      if (certId) {
        navigate(`/admin/certificates/verify?id=${certId}`);
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="certificates-page">
        {/* Header */}
        <AdminHeader />
        <div className="admin-wrapper">
          <Row justify="space-between" className="actions-row">
            <Col>
              <Space>
                <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button icon={<CheckCircleOutlined />} disabled={selectedRowKeys.length === 0} onClick={handleVerify}>
                  Verify
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCertificate}>
                  Add Certificate
                </Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            className="certificates-table"
          />

          <FormCertificate
            showModal={certificateFormVisible}
            onCancel={handleCancelFormCertificate}
            onSubmit={handleSubmitFormCertificate}
            initialValues={editingCertificate}
            loading={formLoading}
          />
        </div>
      </div>
    </>
  );
};

export default CertificatesPage;
