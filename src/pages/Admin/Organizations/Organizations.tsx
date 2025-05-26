import { DeleteOutlined, EditOutlined, ExportOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons"
import { message as AntdMessage, Button, Col, Form, Input, Modal, Row, Select, Space, Spin, Table, Tag } from "antd"
import type React from "react"
import { useEffect, useState } from "react"
import AdminHeader from "../../../components/AdminHeader/adminHeader"
import { Organization, organizationsAPI } from "../../../services/organizationsAPI"
import "./Organizations.scss"

const OrganizationsPage: React.FC = () => {
  const [message, contextHolder] = AntdMessage.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchText, setSearchText] = useState("")
  const [data, setData] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null)
  const [form] = Form.useForm()

  // Load organizations khi component mount
  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    setLoading(true)
    try {
      const response = await organizationsAPI.getAll()
      // Giả sử API trả về object có property data
      const organizations = response || []
      setData(organizations)
    } catch (error: any) {
      message.error(error.message || "Không thể tải danh sách organizations")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Organization["status"]) => {
    switch (status) {
      case "active":
        return "green"
      case "pending":
        return "orange"
      case "suspended":
        return "red"
      default:
        return "default"
    }
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const handleActivate = async () => {
    if (selectedRowKeys.length === 0) return

    setLoading(true)
    try {
      const result = await organizationsAPI.bulkActivate(selectedRowKeys as string[])
      message.success(result.message)
      setSelectedRowKeys([])
      await fetchOrganizations() // Reload data
    } catch (error: any) {
      message.error(error.message || "Không thể kích hoạt organizations")
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    if (selectedRowKeys.length === 0) return

    setLoading(true)
    try {
      const result = await organizationsAPI.bulkSuspend(selectedRowKeys as string[])
      message.success(result.message)
      setSelectedRowKeys([])
      await fetchOrganizations() // Reload data
    } catch (error: any) {
      message.error(error.message || "Không thể tạm ngưng organizations")
    } finally {
      setLoading(false)
    }
  }

  const showModal = (org?: Organization) => {
    if (org) {
      setIsEditMode(true)
      setEditingOrg(org)
      form.setFieldsValue(org)
    } else {
      setIsEditMode(false)
      setEditingOrg(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIsEditMode(false)
    setEditingOrg(null)
    form.resetFields()
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (isEditMode && editingOrg) {
        // Update organization
        await organizationsAPI.update(editingOrg.id, values)
        message.success("Cập nhật organization thành công")
      } else {
        // Create new organization
        await organizationsAPI.create(values)
        message.success("Tạo organization thành công")
      }

      setIsModalVisible(false)
      form.resetFields()
      setIsEditMode(false)
      setEditingOrg(null)
      await fetchOrganizations() // Reload data
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (org: Organization) => {
    showModal(org)
  }

  const handleDelete = (org: Organization) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa organization "${org.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // await organizationsAPI.delete(org.id)
          // message.success("Xóa organization thành công")
          // await fetchOrganizations()
        } catch (error: any) {
          message.error(error.message || "Không thể xóa organization")
        }
      },
    })
  }

  // Lọc dữ liệu theo searchText
  const filteredData = data.filter(
    (org) => !searchText ||
      org.name.toLowerCase().includes(searchText.toLowerCase()) ||
      org.type.toLowerCase().includes(searchText.toLowerCase()),
  )

  console.log("Filtered Data:", filteredData)

  const columns = [
    {
      title: "Organization",
      dataIndex: "name",
      key: "name",
      sorter: (a: Organization, b: Organization) => a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "issuer", value: "Issuer" },
        { text: "verifier", value: "Verifier" },
      ],
      onFilter: (value: any, record: Organization) => record.type === value,
      render: (type: Organization["type"]) => (
        <Tag color={type === "issuer" ? "blue" : "green"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (website: string) =>
        website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Organization["status"]) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Active", value: "active" },
        { text: "Pending", value: "pending" },
        { text: "Suspended", value: "suspended" },
      ],
      onFilter: (value: any, record: Organization) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Organization) => (
        <div className="">
          <Button variant="outlined" color="primary" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Button variant="outlined" className="ms-2" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <div className="organizations-page">
        <AdminHeader />
        <Row justify="space-between" className="users-actions">
          <Col>
            <Space>
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button icon={<ExportOutlined />}>Export</Button>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Add Organization
            </Button>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16, marginTop: 16 }}>
          <Col>
            <Input
              placeholder="Search organizations..."
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
          </Col>

          <Col>
            {selectedRowKeys.length > 0 && (
              <Space>
                <Button type="primary" onClick={handleActivate} loading={loading}>
                  Activate ({selectedRowKeys.length})
                </Button>
                <Button danger onClick={handleSuspend} loading={loading}>
                  Suspend ({selectedRowKeys.length})
                </Button>
              </Space>
            )}
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            className="organizations-table"
            rowKey="id"
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} organizations`,
            }}
          />
        </Spin>

        {/* Modal form thêm/sửa Organization */}
        <Modal
          title={isEditMode ? "Edit Organization" : "Add New Organization"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={isEditMode ? "Update" : "Create"}
          confirmLoading={loading}
          width={600}
        >
          <Form form={form} layout="vertical" name="organization_form">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please input the organization name!" }]}
                >
                  <Input placeholder="Organization name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[{ required: true, message: "Please select organization type!" }]}
                >
                  <Select placeholder="Select organization type">
                    <Select.Option value="issuer">Issuer</Select.Option>
                    <Select.Option value="verifier">Verifier</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Admin Email"
              name="adminEmail"
              rules={[
                { required: true, message: "Please input admin email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="admin@organization.com" />
            </Form.Item>

            {!isEditMode && (
              <Form.Item
                label="Admin Password"
                name="adminPassword"
                rules={[{ required: true, message: "Please input admin password!" }]}
              >
                <Input.Password placeholder="Admin password" />
              </Form.Item>
            )}

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Organization description" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Website" name="website">
                  <Input placeholder="https://organization.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Logo URL" name="logo">
                  <Input placeholder="https://logo-url.com/logo.png" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Wallet Address" name="walletAddress">
              <Input placeholder="0x1234..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  )
}

export default OrganizationsPage
