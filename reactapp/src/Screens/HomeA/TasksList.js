import React from "react";
import { Badge, List, Skeleton, Tag, Space } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const TasksList = ({
  dataSource,
  Update,
  Deletion,
  Done,
  updateClick,
  deleteTask,
  markAsDone,
}) => (
  <List
    className="demo-loadmore-list"
    itemLayout="horizontal"
    dataSource={dataSource}
    renderItem={(item) => (
      <List.Item
        actions={[
          <a
            key="list-loadmore-edit"
            onClick={() => {
              {
                updateClick(item._id);
              }
            }}
          >
            {Update}
          </a>,
          <a key="list-loadmore-edite" onClick={() => deleteTask(item._id)}>
            {Deletion}
          </a>,
          <a key="list-loadmore-edite" onClick={() => markAsDone(item._id)}>
            {Done}
          </a>,
        ]}
      >
        <Skeleton avatar title={false} loading={item.loading} active>
          <List.Item.Meta
            avatar={
              <IconText icon={RightCircleOutlined} key="list-vertical-star-o" />
            }
            title={<a>{item.title}</a>}
            description={item.description}
          />
          <div
            style={{
              margin: "16px",
            }}
          >
            {item.status == "Pas commencé" ? (
              <Badge status="processing" text={item.status} />
            ) : (
              <Badge status="success" text={item.status} />
            )}
          </div>
          <div
            style={{
              margin: "16px",
            }}
          >
            {moment(item.dueDate).format("DD/MM/YY")}
          </div>
          <div
            style={{
              margin: "16px",
            }}
          >
            {item.priority == "Priorité 1" ? (
              <Tag color="magenta">{item.priority}</Tag>
            ) : (
              <Tag color="geekblue">{item.priority}</Tag>
            )}
          </div>
        </Skeleton>
      </List.Item>
    )}
  />
);

export { TasksList };
