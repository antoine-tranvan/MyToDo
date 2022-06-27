import React from "react";
import { Button, Form, Input, Drawer, DatePicker, Select } from "antd";

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const TaskDrawer = ({ title, onClose, visible, onFinish, onFinishFailed }) => (
  <Drawer title={title} placement="right" onClose={onClose} visible={visible}>
    <Form
      name="tasks"
      w
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
        label="TaskName"
        name="TaskName"
        rules={[
          {
            required: true,
            message: "Please input a name for your task!",
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
            message: "Please input a description for your task!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="DueDate"
        name="DueDate"
        rules={[
          {
            required: true,
            message: "Please input a duedate for your task!",
          },
        ]}
      >
        <DatePicker
          // defaultValue={moment("20/06/2022", dateFormatList[0])}
          format={dateFormatList}
        />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="Priority"
        rules={[
          {
            required: true,
            message: "Please input a priority for your task!",
          },
        ]}
      >
        <Select>
          <Select.Option value="Priorité 1">Priorité 1</Select.Option>
          <Select.Option value="Priorité 2">Priorité 2</Select.Option>
        </Select>
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
  </Drawer>
);

export default TaskDrawer;
