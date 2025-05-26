// src/pages/admin/AdminLayout.tsx
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  IdcardOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import "./AdminLayout.scss";
import { useUserInfo } from '../../../hooks/useUserInfo';

const { Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';
  const { userInfo } = useUserInfo();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
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
          {userInfo.role === 'org_manager' &&
            <Menu.Item key="certificates" icon={<IdcardOutlined />}>
              <Link to="/admin/certificates">Certificates</Link>
            </Menu.Item>
          }
          {userInfo.role === 'admin' &&
            <Menu.Item key="organizations" icon={<ApartmentOutlined />}>
              <Link to="/admin/organizations">Organizations</Link>
            </Menu.Item>
          }
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
