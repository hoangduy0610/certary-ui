import {
  Layout,
  Menu,
  Input,
  Badge,
  Avatar,
  Button,
  Row,
  Col,
  Card,
} from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import "./dashboard.scss";

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar
      <Sider collapsible>
        <div className="logo" style={{ color: "#fff", padding: "16px" }}>
          CertManager
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="certificates" icon={<FileTextOutlined />}>
            Certificates
          </Menu.Item>                                                                                              
          <Menu.Item key="users" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="organizations" icon={<TeamOutlined />}>
            Organizations
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider> */}

      {/* Main Content */}
      <Layout>
        {/* Header */}
        <Header style={{ background: "#fff", padding: 0, display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: 24 }}>
          <Input.Search placeholder="Search..." style={{ width: 200 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge count={3}>
              <BellOutlined style={{ fontSize: 18 }} />
            </Badge>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Header>

        {/* Dashboard Content */}
        <Content style={{ margin: "24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Dashboard</h1>
            <Button icon={<DownloadOutlined />} type="primary">
              Download Report
            </Button>
          </div>

          {/* Stats */}
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card
                title="Total Certificates"
                extra={<ReloadOutlined />}
              >
                <h2>1,248</h2>
                <p style={{ color: "green" }}>+12% from last month</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Active Users"
                extra={<ReloadOutlined />}
              >
                <h2>580</h2>
                <p style={{ color: "green" }}>+8% from last month</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="New Organizations"
                extra={<ReloadOutlined />}
              >
                <h2>33</h2>
                <p style={{ color: "red" }}>-5% from last month</p>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
