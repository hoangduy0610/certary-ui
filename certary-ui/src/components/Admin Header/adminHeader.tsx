import React from "react";
import { Input, Badge, Avatar } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";

const { Search } = Input;

const AdminHeader: React.FC = () => {
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
        <Avatar icon={<UserOutlined />} />
      </div>
    </div>
  );
};

export default AdminHeader;
