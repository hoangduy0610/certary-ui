import { Button, Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import { Certificate, CreateCertificateDto } from "../../../services/certificateAPI";

interface FormCertificateProps {
    showModal?: boolean;
    onCancel?: () => void;
    onSubmit?: (values: CreateCertificateDto) => void;
    initialValues?: Partial<Certificate> | null;
    loading?: boolean;
}

const FormCertificate: React.FC<FormCertificateProps> = ({
    showModal = true,
    onCancel = () => { },
    onSubmit = (values) => console.log('Submitted values:', values),
    initialValues = {},
    loading = false,
}: FormCertificateProps) => {
    const [form] = Form.useForm<CreateCertificateDto>();
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
                title="Certificate Form"
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
                        name="title"
                        label="Certificate Name"
                        rules={[{ required: true, message: 'Please input the certificate name!' }]}
                    >
                        <Input placeholder="Enter certificate name" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input placeholder="Enter description" />
                    </Form.Item>
                    <Form.Item
                        name="recipientEmail"
                        label="Recipient Email"
                        rules={[{ required: true, message: 'Please input the recipient email!' }]}
                    >
                        <Input placeholder="Enter recipient email" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FormCertificate;
