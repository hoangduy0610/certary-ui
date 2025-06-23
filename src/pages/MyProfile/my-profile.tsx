"use client"

import {
    CameraOutlined,
    EditOutlined,
    HomeOutlined,
    IdcardOutlined,
    MailOutlined,
    SaveOutlined,
    UserOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Avatar, Button, Card, Col, Divider, Form, Input, Row, Select, Space, Upload, message } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { Header } from "../../components/Header/Header"
import { useUserInfo } from "../../hooks/useUserInfo"
import { fileApi } from "../../services/fileApi"
import { UserAPI } from "../../services/userAPI"
import "./my-profile.scss"

const { Option } = Select

export default function MyProfile() {
    const { userInfo, setUserInfo, getUserInfo } = useUserInfo()
    const [form] = Form.useForm()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string>("")

    useEffect(() => {
        if (userInfo) {
            form.setFieldsValue({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                walletAddress: userInfo.walletAddress,
                role: userInfo.role,
                createdAt: userInfo.createdAt ? moment(userInfo.createdAt) : null,
                organizationName: userInfo.organization?.name,
            })
            setAvatarUrl(userInfo.avatar || "")
        }
    }, [userInfo, form])

    const handleSave = async (values: any) => {
        setLoading(true)
        try {
            const dataDto = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                // walletAddress: values.walletAddress,
                avatar: avatarUrl,
            }

            await UserAPI.updateProfile(dataDto)
            await getUserInfo();
            message.success("Profile updated successfully!")
            setIsEditing(false)
        } catch (error) {
            message.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        form.setFieldsValue({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
        })
        setIsEditing(false)
        setAvatarUrl(userInfo.avatar || "")
    }

    const uploadProps: UploadProps = {
        name: "avatar",
        listType: "picture",
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
            if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG file!")
                return false
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                message.error("Image must smaller than 2MB!")
                return false
            }

            // Convert to base64 for preview
            const reader = new FileReader()
            reader.onload = async () => {
                const urlImg = await fileApi.uploadFile(file)
                setAvatarUrl(urlImg)
            }
            reader.readAsDataURL(file)

            return false // Prevent auto upload
        },
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin":
                return "#f50"
            case "org_manager":
                return "#2db7f5"
            case "org_staff":
                return "#87d068"
            default:
                return "#108ee9"
        }
    }

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "admin":
                return "Administrator"
            case "org_manager":
                return "Organization Manager"
            case "org_staff":
                return "Organization Staff"
            case "user":
                return "User"
            default:
                return role
        }
    }

    return (
        <div className="my-profile-page">
            <Header active="my-profile" />
            <div className="profile-header">
                <div className="profile-header-content">
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account settings</p>
                </div>
                <div className="header-shape"></div>
            </div>

            <div className="profile-container">
                <Row gutter={[24, 24]}>
                    {/* Avatar and Basic Info Card */}
                    <Col xs={24} lg={8}>
                        <Card className="profile-avatar-card">
                            <div className="avatar-section">
                                <div className="avatar-wrapper">
                                    <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} className="profile-avatar" />
                                    {isEditing && (
                                        <Upload {...uploadProps}>
                                            <Button className="avatar-upload-btn" icon={<CameraOutlined />} shape="circle" size="small" />
                                        </Upload>
                                    )}
                                </div>
                                <div className="user-basic-info">
                                    <h2>{`${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || "User Name"}</h2>
                                    <div className="user-role" style={{ color: getRoleBadgeColor(userInfo.role || "user") }}>
                                        {getRoleDisplayName(userInfo.role || "user")}
                                    </div>
                                    <div className="user-email">
                                        <MailOutlined /> {userInfo.email}
                                    </div>
                                    {userInfo.organization && (
                                        <div className="user-organization">
                                            <HomeOutlined /> {userInfo.organization.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Divider />

                            <div className="profile-stats">
                                <div className="stat-item">
                                    <div className="stat-value">
                                        {userInfo.createdAt ? moment(userInfo.createdAt).format("MMM YYYY") : "N/A"}
                                    </div>
                                    <div className="stat-label">Member Since</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{userInfo.walletAddress ? "Connected" : "Not Connected"}</div>
                                    <div className="stat-label">Wallet Status</div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Profile Form Card */}
                    <Col xs={24} lg={16}>
                        <Card
                            className="profile-form-card"
                            title="Personal Information"
                            extra={
                                <Space>
                                    {!isEditing ? (
                                        <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <>
                                            <Button onClick={handleCancel}>Cancel</Button>
                                            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={() => form.submit()}>
                                                Save Changes
                                            </Button>
                                        </>
                                    )}
                                </Space>
                            }
                        >
                            <Form form={form} layout="vertical" onFinish={handleSave} disabled={!isEditing}>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label="First Name"
                                            name="firstName"
                                            rules={[{ required: true, message: "Please input your first name!" }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Enter your first name" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label="Last Name"
                                            name="lastName"
                                            rules={[{ required: true, message: "Please input your last name!" }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Enter your last name" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Email Address"
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please input your email!" },
                                        { type: "email", message: "Please enter a valid email!" },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="Enter your email address" />
                                </Form.Item>

                                <Form.Item label="Wallet Address" name="walletAddress">
                                    <Input prefix={<IdcardOutlined />} placeholder="Your wallet address" disabled readOnly />
                                </Form.Item>

                                {/* <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label="Role" name="role">
                                            <Select disabled placeholder="Select role">
                                                <Option value="user">User</Option>
                                                <Option value="org_staff">Organization Staff</Option>
                                                <Option value="org_manager">Organization Manager</Option>
                                                <Option value="admin">Administrator</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label="Member Since" name="createdAt">
                                            <DatePicker disabled style={{ width: "100%" }} format="YYYY-MM-DD" />
                                        </Form.Item>
                                    </Col>
                                </Row> */}

                                {userInfo.organization && (
                                    <Form.Item label="Organization" name="organizationName">
                                        <Input prefix={<HomeOutlined />} disabled placeholder="Organization name" />
                                    </Form.Item>
                                )}
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
