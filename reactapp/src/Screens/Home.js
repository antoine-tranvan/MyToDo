import { translation } from "../I18n/I18n";
import {
  RightCircleOutlined,
  CloseSquareOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Layout,
  Menu,
  Button,
  List,
  Skeleton,
  Space,
  message,
  Select,
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import ListButton from "../Components/ListButton";
import ListModal from "../Components/ListModal";
import TaskDrawer from "../Components/TaskDrawer";
import TasksList from "../Components/TasksList";

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
      body: `TaskName=${values.TaskName}&description=${values.Description}&DueDate=${values.DueDate}&Priority=${values.Priority}&token=${props.token}&id=${idList}`,
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
      body: `title=${values.TaskName}&description=${values.Description}&DueDate=${values.DueDate}&Priority=${values.Priority}&token=${props.token}&listId=${idList}&taskId=${idTask}`,
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

  const onCloseCreate = () => {
    setVisibleCreate(false);
  };

  const onCloseUpdate = () => {
    setVisibleUpdate(false);
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

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header
        className="site-layout-background"
        style={{
          paddingLeft: 20,
          fontSize: 20,

          backgroundColor: "#d1453b",
        }}
      >
        <div className="header">
          <div
            style={{
              color: "white",
            }}
          >
            {translation(props.language, "titre")} {username} 👋 !
          </div>
          <div className="headerTopRight">
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
            <Link to="/">
              <LogoutOutlined
                style={{
                  color: "white",
                  marginLeft: 15,
                }}
              />
            </Link>
          </div>
        </div>
      </Header>
      <Layout className="site-layout">
        <Sider
          // collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            backgroundColor: "#f3f3f3",
          }}
        >
          <ListButton
            margin="16px"
            label={translation(props.language, "ListCreation")}
            handleClick={showModalCreate}
          />
          <ListModal
            title="Create a new list"
            visible={isModalVisibleCreate}
            onOk={handleOkCreate}
            onCancel={handleCancelCreate}
            onFinish={onFinishCreate}
            onFinishFailed={onFinishFailed}
          />
          <Menu
            theme="light"
            defaultSelectedKeys={["0"]}
            mode="inline"
            items={lists}
            onClick={onClick}
            style={{
              backgroundColor: "#f3f3f3",
            }}
          />
        </Sider>

        <Content
          style={{
            backgroundColor: "white",
            paddingLeft: "100px",
            paddingRight: "200px",
          }}
        >
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
              <ListButton
                margin="1px"
                label={translation(props.language, "ListUpdate")}
                handleClick={showModalUpdate}
              />
              <ListModal
                title="Update current list"
                visible={isModalVisibleUpdate}
                onOk={handleOkUpdate}
                onCancel={handleCancelUpdate}
                onFinish={onFinishUpdate}
                onFinishFailed={onFinishFailed}
              />
              <ListButton
                margin="1px"
                label={translation(props.language, "TaskCreation")}
                handleClick={showDrawer}
              />
            </div>
            <TaskDrawer
              title="Create a new task"
              onClose={onCloseCreate}
              visible={visibleCreate}
              onFinish={onFinishDrawer}
              onFinishFailed={onFinishFailed}
            />
            <TasksList
              dataSource={tasksList}
              Update={translation(props.language, "TaskUpdate")}
              Deletion={translation(props.language, "TaskDeletion")}
              Done={translation(props.language, "TaskMarkAsDone")}
              updateClick={updateClick}
              deleteTask={deleteTask}
              markAsDone={markAsDone}
            />
          </div>
          <TaskDrawer
            title="Update an existing task"
            onClose={onCloseUpdate}
            visible={visibleUpdate}
            onFinish={onFinishDrawerUpdate}
            onFinishFailed={onFinishFailed}
          />
        </Content>
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
