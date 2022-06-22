import { translation } from "../I18n/I18n";
import {
  PlusCircleOutlined,
  RightCircleOutlined,
  CloseSquareOutlined,
  UpCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  Button,
  Modal,
  Form,
  Input,
  Drawer,
  DatePicker,
  List,
  Skeleton,
  Space,
  message,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

const { Header, Content, Footer, Sider } = Layout;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const { Option } = Select;

const Home = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisibleCreate, setIsModalVisibleCreate] = useState(false);
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [lists, setLists] = useState([]);
  const [rawLists, setRawLists] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [idList, setIdList] = useState("noId");
  const [idTask, setidTask] = useState();
  const [indexMenu, setIndexMenu] = useState(0);
  const [loading0, setLoading0] = useState(false);
  const [username, setUsername] = useState();
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tasksList, setTasksList] = useState([]);

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

  useEffect(() => {
    async function loadDataLists() {
      setLoading0(true);
      var rawResponse = await fetch("lists/get-lists", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}`,
      });

      var data = await rawResponse.json();

      let items = data.userLists.map((el, index) => getItem(el.title, index));

      setLists(items);
      setRawLists(data.userLists);
      setUsername(data.user);

      if (idList == "noId") {
        setIdList(data.userLists[0]._id);
      }
      setLoading0(false);
    }
    loadDataLists();
  }, [trigger]);

  useEffect(() => {
    async function loadDataTasks() {
      setLoading0(true);
      var rawResponse = await fetch("tasks/get-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}&listId=${idList}`,
      });

      var data = await rawResponse.json();

      if (data.taskslist[0].tasks) {
        setTasksList(data.taskslist[0].tasks);
      }
      setLoading0(false);
    }
    loadDataTasks();
  }, [trigger]);

  const onFinishCreate = async function (values) {
    console.log("Success:", values.ListName, props.token);

    let rawResponse = await fetch("lists/create-list", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `ListName=${values.ListName}&description=${values.Description}&token=${props.token}`,
    });

    let response = await rawResponse.json();
    setIsModalVisibleCreate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageListCreated")}`, 3);
  };

  const onFinishUpdate = async function (values) {
    let rawResponse = await fetch("lists/update-list", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=${values.ListName}&description=${values.Description}&token=${props.token}&listId=${idList}`,
    });

    let response = await rawResponse.json();
    setIsModalVisibleUpdate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageListUpdated")}`, 3);
  };

  const deleteList = async () => {
    if (idList == "noId") {
      message.error("Sélectionner une liste dans le menu de gauche", 3);
    } else {
      let rawResponse = await fetch("lists/delete-list", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}&listId=${idList}`,
      });

      let response = await rawResponse.json();
      setTrigger(!trigger);

      if (response.countcheck == 1) {
        message.info(`${translation(props.language, "MessageListDeleted")}`, 3);
      } else {
        message.error(
          "Merci de sélectionner une liste à supprimer dans le menu",
          3
        );
      }
    }
  };

  const onFinishDrawer = async function (values) {
    let rawResponse = await fetch("tasks/create-task", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `TaskName=${values.TaskName}&description=${values.Description}&DueDate=${values.DueDate}&token=${props.token}&id=${idList}`,
    });

    let response = await rawResponse.json();
    setVisibleCreate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageTaskCreated")}`, 3);
  };

  const deleteTask = async (taskId) => {
    let rawResponse = await fetch("tasks/delete-task", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `taskId=${taskId}&token=${props.token}&listId=${idList}`,
    });

    let response = await rawResponse.json();
    message.info(`${translation(props.language, "MessageTaskDeleted")}`, 3);
    setTrigger(!trigger);
  };

  const markAsDone = async (taskId) => {
    let rawResponse = await fetch("tasks/mark-task-as-done", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `taskId=${taskId}&token=${props.token}&listId=${idList}`,
    });

    let response = await rawResponse.json();
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageTaskDone")}`, 3);
  };

  const onFinishDrawerUpdate = async function (values) {
    console.log("le bouton fonctionne");
    let rawResponse = await fetch("tasks/update-task", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=${values.TaskName}&description=${values.Description}&DueDate=${values.DueDate}&token=${props.token}&listId=${idList}&taskId=${idTask}`,
    });

    setVisibleUpdate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageTaskUpdated")}`, 3);
  };

  const showModalCreate = () => {
    setIsModalVisibleCreate(true);
  };

  const handleOkCreate = () => {
    setIsModalVisibleCreate(false);
  };

  const handleCancelCreate = () => {
    setIsModalVisibleCreate(false);
  };

  const showModalUpdate = () => {
    setIsModalVisibleUpdate(true);
  };

  const handleOkUpdate = () => {
    setIsModalVisibleUpdate(false);
  };

  const handleCancelUpdate = () => {
    setIsModalVisibleUpdate(false);
  };

  const onClick = ({ item, key }) => {
    setIdList(rawLists[key]._id);
    setIndexMenu(key);
    setTrigger(!trigger);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showDrawer = () => {
    setVisibleCreate(true);
  };

  const onClose = () => {
    setVisibleCreate(false);
  };

  const updateClick = function (item) {
    setVisibleUpdate(true);
    setidTask(item);
  };

  const handleChange = (value) => {
    if (value == "Français") {
      props.changeLanguageFR();
    } else if (value == "English") {
      props.changeLanguageEN();
    }
    console.log(`selected ${value}`);
  };

  return rawLists.length == 0 ? (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        // collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            paddingLeft: 20,
            fontSize: 20,
          }}
        >
          <div className="header">
            <div>
              {translation(props.language, "titre")} {username} 👋 !
            </div>
            <Select
              defaultValue="Français"
              style={{
                width: 120,
                marginTop: 15,
              }}
              onChange={handleChange}
              showArrow={false}
            >
              <Option value="English">English</Option>
              <Option value="Français">Français</Option>
            </Select>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          ></Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <div>
              <div>{translation(props.language, "IntroText")}</div>
              <Button
                style={{
                  marginTop: 10,
                  margin: "4px",
                }}
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={showModalCreate}
              >
                {translation(props.language, "ListCreation")}
              </Button>
              <Modal
                title="Create a new list"
                visible={isModalVisibleCreate}
                onOk={handleOkCreate}
                onCancel={handleCancelCreate}
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
                  onFinish={onFinishCreate}
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
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          ©2022 Created by ATV
        </Footer>
      </Layout>
    </Layout>
  ) : (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        // collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Button
          style={{
            margin: "16px",
          }}
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={showModalCreate}
        >
          {translation(props.language, "ListCreation")}
        </Button>
        <Modal
          title="Create a new list"
          visible={isModalVisibleCreate}
          onOk={handleOkCreate}
          onCancel={handleCancelCreate}
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
            onFinish={onFinishCreate}
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
        <Menu
          theme="dark"
          defaultSelectedKeys={["0"]}
          mode="inline"
          items={lists}
          onClick={onClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            paddingLeft: 20,
            fontSize: 20,
          }}
        >
          <div className="header">
            <div>
              {translation(props.language, "titre")} {username} 👋 !
            </div>
            <Select
              defaultValue="Français"
              style={{
                width: 120,
                marginTop: 15,
              }}
              onChange={handleChange}
              showArrow={false}
            >
              <Option value="English">English</Option>
              <Option value="Français">Français</Option>
            </Select>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          ></Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <div className="container">
              <div
                style={{
                  marginBottom: 16,
                  marginRight: 16,
                  fontSize: 24,
                }}
              >
                {indexMenu < rawLists.length ? (
                  rawLists[indexMenu].title
                ) : (
                  <div></div>
                )}
              </div>
              <Button
                style={{
                  margin: "1px",
                }}
                type="danger"
                icon={<CloseSquareOutlined />}
                onClick={deleteList}
              >
                {translation(props.language, "ListDeletion")}
              </Button>
              <Button
                style={{
                  margin: "1px",
                }}
                type="primary"
                icon={<UpCircleOutlined />}
                onClick={showModalUpdate}
              >
                {translation(props.language, "ListUpdate")}
              </Button>
              <Modal
                title="Update current list"
                visible={isModalVisibleUpdate}
                onOk={handleOkUpdate}
                onCancel={handleCancelUpdate}
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
                  onFinish={onFinishUpdate}
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

              <Button
                style={{
                  margin: "1px",
                }}
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={showDrawer}
              >
                {translation(props.language, "TaskCreation")}
              </Button>
            </div>
            <Drawer
              title="Create a new task"
              placement="right"
              onClose={onClose}
              visible={visibleCreate}
            >
              <Form
                name="tasks"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinishDrawer}
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
                    defaultValue={moment("20/06/2022", dateFormatList[0])}
                    format={dateFormatList}
                  />
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

            <List
              className="demo-loadmore-list"
              // loading={initLoading}
              itemLayout="horizontal"
              dataSource={tasksList}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="list-loadmore-edit"
                      onClick={() => {
                        updateClick(item._id);
                      }}
                    >
                      {translation(props.language, "TaskUpdate")}
                    </a>,
                    <a
                      key="list-loadmore-edite"
                      onClick={() => deleteTask(item._id)}
                    >
                      {translation(props.language, "TaskDeletion")}
                    </a>,
                    <a
                      key="list-loadmore-edite"
                      onClick={() => markAsDone(item._id)}
                    >
                      {translation(props.language, "TaskMarkAsDone")}
                    </a>,
                  ]}
                >
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={
                        <IconText
                          icon={RightCircleOutlined}
                          key="list-vertical-star-o"
                        />
                      }
                      title={<a>{item.title}</a>}
                      description={item.description}
                    />
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
                      {item.status}
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </div>
          <Drawer
            title="Update an existing task"
            placement="right"
            onClose={onClose}
            visible={visibleUpdate}
          >
            <Form
              name="tasks"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinishDrawerUpdate}
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
                  defaultValue={moment("20/06/2022", dateFormatList[0])}
                  format={dateFormatList}
                />
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
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          ©2022 Created by ATV
        </Footer>
      </Layout>
    </Layout>
  );
};

function mapStateToProps(state) {
  return { token: state.token, language: state.language };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLanguageFR: function () {
      dispatch({
        type: "FR",
      });
    },
    changeLanguageEN: function () {
      dispatch({
        type: "EN",
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
