import { Button, Modal, Form, Input } from "antd";
import react from "react";
import { connect } from "react-redux";

const CreateModal = ({
  title,
  visible,
  onOk,
  onCancel,
  onFinish,
  onFinishFailed,
}) => (
  <Modal
    title={title}
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
    footer={null}
  >
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="ListName"
        name="ListName"
        rules={[
          {
            required: true,
            message: "Please input a name for your list!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="Description"
        rules={[
          {
            required: true,
            message: "Please input a description for your list!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default CreateModal;
