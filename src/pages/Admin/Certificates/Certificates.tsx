import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Space, Table, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../components/AdminHeader/adminHeader';
import { Certificate, CertificateAPI, CreateCertificateDto, EnumCertificateStatus } from '../../../services/certificateAPI';
import { Organization } from '../../../services/organizationsAPI';
import { User } from '../../../services/userAPI';
import { handleDownloadCertificate } from '../../../utils/file';
import { renderCertQr } from '../../../utils/uri';
import './Certificates.scss';
import FormCertificate from './FormCertificate';
import { useUserInfo } from '../../../hooks/useUserInfo';

const CertificatesPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [formLoading, setFormLoading] = useState(false);
  const [certificateFormVisible, setCertificateFormVisible] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [rejectingCertificate, setRejectingCertificate] = useState<Certificate | null>(null);
  const [formRejectLoading, setFormRejectLoading] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [data, setData] = useState<Certificate[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { userInfo } = useUserInfo();
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

  const handleApproveCert = async (certificate: Certificate) => {
    try {
      await CertificateAPI.approve(certificate.id);
      messageApi.success('Certificate issued successfully');
      fetchCertificates(); // Refresh the certificate list
    } catch (error) {
      messageApi.error('Error issuing certificate');
    }
  }

  const handleOpenRejectModal = (certificate: Certificate) => {
    setRejectingCertificate(certificate);
    setOpenRejectModal(true);
  };

  const handleRejectCert = async (certificate: Certificate, reason?: string) => {
    setFormRejectLoading(true);
    try {
      await CertificateAPI.reject(certificate.id, reason || '');
      messageApi.success('Certificate rejected successfully');
      setOpenRejectModal(false);
      fetchCertificates(); // Refresh the certificate list
    } catch (error) {
      messageApi.error('Error rejecting certificate');
    }
    setFormRejectLoading(false);
  };

  const mapStatusColor = (status: EnumCertificateStatus): string => {
    switch (status) {
      case EnumCertificateStatus.DRAFT:
        return 'blue';
      case EnumCertificateStatus.REJECTED:
        return 'orange';
      case EnumCertificateStatus.ISSUED:
        return 'green';
      case EnumCertificateStatus.CLAIMED:
        return 'purple';
      case EnumCertificateStatus.REVOKED:
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (_: number, cert: Certificate) => (
        <img width="75" src={renderCertQr(cert.certificateId || "")} />
      ),
    },
    {
      title: 'Token ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
    },
    {
      title: 'Certificate ID',
      dataIndex: 'certificateId',
      key: 'certificateId',
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
        return <Tag color={owner ? 'green' : 'red'}>{owner ? `${owner.firstName} ${owner.lastName}` : "NOT REGISTED"}</Tag>;
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
      render: (status: EnumCertificateStatus) => {
        const statusMap: Record<EnumCertificateStatus, string> = {
          [EnumCertificateStatus.DRAFT]: 'Draft',
          [EnumCertificateStatus.REJECTED]: 'Rejected',
          [EnumCertificateStatus.ISSUED]: 'Issued',
          [EnumCertificateStatus.CLAIMED]: 'Claimed',
          [EnumCertificateStatus.REVOKED]: 'Revoked',
          [EnumCertificateStatus.EXPIRED]: 'Expired',
        }
        return <Tag color={mapStatusColor(status)}>
          {statusMap[status] || 'Unknown Status'}
        </Tag>;
      }
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark'
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
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      render: (expiredAt: Date) => {
        return moment(expiredAt).format('YYYY-MM-DD');
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Certificate) => (
        <Space size="middle">
          <Tooltip title="Download Certificate">
            <Button variant="outlined" color="primary" onClick={() => {
              handleDownloadCertificate(record, messageApi);
            }}>
              <DownloadOutlined />
            </Button>
          </Tooltip>
          {
            (record.status === EnumCertificateStatus.DRAFT || record.status === EnumCertificateStatus.REJECTED) &&
            <Tooltip title="Edit Certificate">
              <Button variant="outlined" color="primary" onClick={() => {
                handleEditCertificate(record);
              }}>
                <EditOutlined />
              </Button>
            </Tooltip>
          }
          {
            (record.status === EnumCertificateStatus.DRAFT && userInfo?.role === "org_manager") &&
            <Tooltip title="Approve Certificate">
              <Button variant="outlined" color="green" onClick={() => {
                handleApproveCert(record);
              }}>
                <CheckCircleOutlined />
              </Button>
            </Tooltip>
          }
          {
            (record.status === EnumCertificateStatus.DRAFT && userInfo?.role === "org_manager") &&
            <Tooltip title="Reject Certificate">
              <Button variant="outlined" color="red" onClick={() => {
                handleOpenRejectModal(record);
              }}>
                <CloseCircleOutlined />
              </Button>
            </Tooltip>
          }
          {
            (record.status === EnumCertificateStatus.ISSUED || record.status === EnumCertificateStatus.CLAIMED) && (
              <Tooltip title="Revoke Certificate">
                <Popconfirm
                  title="Are you sure you want to revoke this certificate?"
                  onConfirm={async () => {
                    try {
                      await CertificateAPI.revoke(record.id);
                      messageApi.success('Certificate revoke successfully');
                      fetchCertificates(); // Refresh the certificate list
                    } catch (error) {
                      messageApi.error('Error revoking certificate');
                    }
                  }}
                >
                  <Button variant="outlined" className="" danger>
                    <StopOutlined />
                  </Button>
                </Popconfirm>
              </Tooltip>
            )
          }
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
      const certId = data.find(cert => cert.id === selectedRowKeys[0])?.certificateId;
      if (certId) {
        navigate(`/admin/certificates/verify?id=${certId}`);
        return;
      }
    }

    navigate('/admin/certificates/verify');
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
                {/* <Button icon={<FilterOutlined />}>Filter</Button>
                <Button icon={<ExportOutlined />}>Export</Button> */}
              </Space>
            </Col>
            <Col>
              <Space>
                {/* <Button icon={<CheckCircleOutlined />} onClick={handleVerify}>
                  Verify
                </Button> */}
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCertificate}>
                  Add Certificate
                </Button>
              </Space>
            </Col>
          </Row>
          <Table
            rowKey="id"
            // rowSelection={{ type: 'radio', ...rowSelection }}
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

          <Modal
            title="Reject Certificate"
            open={openRejectModal}
            footer={null}
          >
            <Form
              layout="vertical"
              onFinish={async (values) => {
                await handleRejectCert(rejectingCertificate!, values.reason);
              }}
            >
              <Form.Item
                label="Reason for rejection"
                name="reason"
                rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={formRejectLoading}>
                  Reject Certificate
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div >
    </>
  );
};

export default CertificatesPage;
