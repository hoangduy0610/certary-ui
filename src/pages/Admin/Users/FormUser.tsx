import { Button, Form, Input, message, Modal, Select, Spin } from "antd";
import { useEffect } from "react";
import { UpdateUserDto, User } from "../../../services/userAPI";
import { LoadingOutlined } from "@ant-design/icons";

interface FormUserProps {
    showModal?: boolean;
    onCancel?: () => void;
    onSubmit?: (values: UpdateUserDto) => void;
    initialValues?: Partial<User> | null;
    loading?: boolean;
}

const FormUser: React.FC<FormUserProps> = ({
    showModal = true,
    onCancel = () => { },
    onSubmit = (values) => console.log('Submitted values:', values),
    initialValues = {},
    loading = false,
}: FormUserProps) => {
    const [form] = Form.useForm<UpdateUserDto>();
    const [messageApi, contextHolder] = message.useMessage();

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
            })
            .catch(info => {
                messageApi.error('Validation failed');
            });
    };

    useEffect(() => {
        if (!showModal) {
            form.resetFields();
        }

        if (initialValues && Object.keys(initialValues).length > 0) {
            form.setFieldsValue(initialValues);
        }
    }, [showModal, initialValues, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="User Form"
                open={showModal}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText={
                    <Button type="primary" loading={loading} style={{ display: "flex", alignItems: "center", padding: 0 }}>
                        {/* {loading && <Spin indicator={<LoadingOutlined color="#ffffff" spin />} size="small" style={{ color: "white", marginRight: 8 }} />} */}
                        Save
                    </Button>
                }
                cancelText="Cancel"
            >
                <Form
                    form={form}
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input type="email" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="org_manager">Organization Manager</Select.Option>
                            <Select.Option value="org_staff">Organization Staff</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FormUser;
