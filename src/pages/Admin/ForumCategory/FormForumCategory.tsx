import { Button, Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { IconDisplay, IconPicker } from "../../../components/IconPicker/IconPicker";
import { ForumCategory } from "../../../services/forumAPI";

interface FormForumCategoryProps {
    showModal?: boolean;
    onCancel?: () => void;
    onSubmit?: (values: Partial<ForumCategory>) => void;
    initialValues?: Partial<ForumCategory> | null;
    loading?: boolean;
}

const FormForumCategory: React.FC<FormForumCategoryProps> = ({
    showModal = true,
    onCancel = () => { },
    onSubmit = (values) => console.log('Submitted values:', values),
    initialValues = {},
    loading = false,
}: FormForumCategoryProps) => {
    const [showIconPickerModal, setShowIconPickerModal] = useState(false);
    const [form] = Form.useForm<Partial<ForumCategory>>();
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
                title="Forum Category Form"
                open={showModal}
                onCancel={handleCancel}
                onOk={handleSubmit}
                okText={
                    <Button type="primary" loading={loading} style={{ display: "flex", alignItems: "center", padding: 0 }}>
                        Save
                    </Button>
                }
                cancelText="Cancel"
            >
                <Form
                    form={form}
                >
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        // rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input.TextArea placeholder="Enter description" rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="icon"
                        label="Icon (Click to select)"
                        initialValue={'tagOutlined'}
                        rules={[{ required: true, message: 'Please input the icon!' }]}
                    >
                        {/* <Input placeholder="Enter icon URL or name" /> */}
                        <Button
                            variant="outlined"
                            color="default"
                            style={{
                                width: 50,
                                height: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={() => {
                                setShowIconPickerModal(true);
                            }}
                        >
                            <IconDisplay icon={form.getFieldValue('icon') || 'tagOutlined'} style={{ fontSize: 24 }} />
                        </Button>
                        <IconPicker
                            visible={showIconPickerModal}
                            onOk={(icon) => {
                                if (icon) {
                                    form.setFieldsValue({ icon: icon });
                                    setShowIconPickerModal(false);
                                }
                            }}
                            onCancel={() => {
                                setShowIconPickerModal(false);
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default FormForumCategory;
