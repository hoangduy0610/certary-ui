import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Input } from "antd";
import React from "react";
import { logout } from "../../utils/auth";
import { useUserInfo } from "../../hooks/useUserInfo";

const { Search } = Input;

const AdminHeader: React.FC = () => {
  const menu = {
    items: [
      {
        key: "10",
        label: <span style={{ fontSize: 14 }}>Logout</span>,
        onClick: () => {
          logout();
        }
      }
    ]
  }

  const { userInfo } = useUserInfo();

  return (
    <div
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "flex-end", // Chuyển item sang phải
        alignItems: "center",
        height: 64,
        borderBottom: "1px solid #f0f0f0",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Badge count={0}>
          <BellOutlined style={{ fontSize: 18 }} />
        </Badge>

        <Dropdown menu={menu} trigger={['click']}>
          <span style={{ cursor: "pointer" }}>
            {userInfo?.avatar ? (
              <Avatar src={userInfo.avatar} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminHeader;
