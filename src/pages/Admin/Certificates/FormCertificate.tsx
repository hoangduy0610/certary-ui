import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Certificate, CreateCertificateDto } from "../../../services/certificateAPI";
import { CertificateType, CertificateTypeAPI } from "../../../services/certificateTypeAPI";

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
    const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const fetchCertificateTypes = async () => {
        try {
            // Assuming you have a service to fetch certificate types
            const types = await CertificateTypeAPI.getAll(); // Replace with actual API call
            setCertificateTypes(types);
        } catch (error) {
            messageApi.error('Failed to load certificate types');
        }
    }

    useEffect(() => {
        fetchCertificateTypes();
    }, []);

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
            console.log('Setting initial values:', initialValues);
            form.setFieldsValue({
                ...initialValues,
                expiredAt: initialValues.expiredAt ? moment(initialValues.expiredAt) : undefined,
            });
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
                        name="certificateTypeId"
                        label="Certificate Type"
                        rules={[{ required: true, message: 'Please select a certificate type!' }]}
                    >
                        <Select placeholder="Select certificate type">
                            {certificateTypes.map(type => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
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
                    <Form.Item
                        name="expiredAt"
                        label="Expiration Date"
                        rules={[{ required: true, message: 'Please select the expiration date!' }]}
                    >
                        <DatePicker type="date" placeholder="Select expiration date" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FormCertificate;
