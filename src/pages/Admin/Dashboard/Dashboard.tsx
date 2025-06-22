import {
  ReloadOutlined
} from "@ant-design/icons";
import {
  Card,
  Col,
  Layout,
  Row
} from "antd";
import AdminHeader from "../../../components/AdminHeader/adminHeader";
import "./Dashboard.scss";

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Header */}
      <AdminHeader />
      {/* Dashboard Content */}
      <div className="admin-wrapper" style={{ margin: "24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Dashboard</h1>
          {/* <Button icon={<DownloadOutlined />} type="primary">
            Download Report
          </Button> */}
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
      </div>
    </div>
  );
}
