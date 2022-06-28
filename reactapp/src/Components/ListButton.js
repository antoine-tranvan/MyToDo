import React from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ListButton = ({ label, handleClick, margin }) => (
  <Button
    style={{
      margin: margin,
    }}
    type="primary"
    icon={<PlusCircleOutlined />}
    onClick={handleClick}
  >
    {label}
  </Button>
);

export { ListButton };
