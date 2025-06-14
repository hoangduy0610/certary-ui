import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Switch } from 'antd';
import { CertificateType } from '../../../services/certificateTypeAPI';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<CertificateType>) => void;
  initialValues: CertificateType | null;
  loading: boolean;
}

const FormCertificateType: React.FC<Props> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={visible}
      title={initialValues ? 'Edit Certificate Type' : 'Add Certificate Type'}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          active: true,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input name' }]}
        >
          <Input placeholder="e.g. Completion Certificate" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: 'Please input code' }]}
        >
          <Input placeholder="e.g. CC-001" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea placeholder="Enter description..." rows={3} />
        </Form.Item>

        <Form.Item
          name="active"
          label="Status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormCertificateType;
