// src/pages/admin/AdminLayout.tsx
import {
  ApartmentOutlined,
  DashboardOutlined,
  IdcardOutlined,
  ReadOutlined,
  TagOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUserInfo } from '../../../hooks/useUserInfo';
import "./AdminLayout.scss";

const { Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';
  const { userInfo } = useUserInfo() || {
    organization: { type: "issuer" },
    role: "admin",
  };
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible onCollapse={(collapsed) => setCollapsed(collapsed)}>
        <div className="d-flex align-items-center my-2 justify-content-center logo-container">
          {!collapsed && <h2 className="text-white">Certary</h2>}
          {collapsed && <h2 className="text-white">C</h2>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey.toLowerCase()]}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>

          {userInfo?.organization?.type === "issuer" && (
            <>
              <Menu.Item key="certificates" icon={<IdcardOutlined />}>
                <Link to="/admin/certificates">Certificates</Link>
              </Menu.Item>
              <Menu.Item key="custom-certificates" icon={<IdcardOutlined />}>
                <Link to="/admin/custom-certificates">Templates</Link>
              </Menu.Item>
            </>
          )}

          {/* <Menu.Item key="certificate-types" icon={<BookOutlined />}>
            <Link to="/admin/certificate-types">Certificate Types</Link>
          </Menu.Item> */}

          {userInfo?.organization?.type === "verifier" && (
            <Menu.Item key="verifier-verify" icon={<IdcardOutlined />}>
              <Link to="/admin/verifier-verify">Verify Certificates</Link>
            </Menu.Item>
          )}

          {userInfo.role === 'admin' && (
            <>
              <Menu.Item key="organizations" icon={<ApartmentOutlined />}>
                <Link to="/admin/organizations">Organizations</Link>
              </Menu.Item>
              <Menu.Item key="forum-category" icon={<TagOutlined />}>
                <Link to="/admin/forum-category">Forum Category</Link>
              </Menu.Item>
              <Menu.Item key="forum-post" icon={<ReadOutlined />}>
                <Link to="/admin/forum-post">Forum Post</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: 0, padding: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
