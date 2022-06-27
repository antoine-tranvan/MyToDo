import { translation } from "../I18n/I18n";
import { CloseSquareOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, message, Layout } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import TaskDrawer from "../Screens/HomeA/TaskDrawer";
import TasksList from "../Screens/HomeA/TasksList";
import ListButton from "./ListButton";
import ListModal from "./ListModal";

const { Content } = Layout;

const GlobalContent = (props) => {
  const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [idTask, setidTask] = useState();
  const [tasksList, setTasksList] = useState([]);

  useEffect(() => {
    async function loadDataTasks() {
      var rawResponse = await fetch("tasks/get-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}&listId=${props.idList}`,
      });

      var data = await rawResponse.json();
      if (data.taskslist[0].tasks) {
        setTasksList(data.taskslist[0].tasks);
      }
    }
    loadDataTasks();
  }, [props.idList, trigger]);

  const onFinishUpdate = async function (values) {
    let rawResponse = await fetch("lists/update-list", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=${values.ListName}&description=${values.Description}&token=${props.token}&listId=${props.idList}`,
    });

    await rawResponse.json();
    setIsModalVisibleUpdate(false);
    setTrigger(!trigger);
    props.setTrigger();
    message.info(`${translation(props.language, "MessageListUpdated")}`, 3);
  };

  const deleteList = async () => {
    if (props.idList == "noId") {
      message.error("Sélectionner une liste dans le menu de gauche", 3);
    } else {
      let rawResponse = await fetch("lists/delete-list", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}&listId=${props.idList}`,
      });

      let response = await rawResponse.json();
      setTrigger(!trigger);

      if (response.countcheck == 1) {
        message.info(`${translation(props.language, "MessageListDeleted")}`, 3);
        props.setIdList("");
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
      body: `TaskName=${values.TaskName}&description=${values.Description}&DueDate=${values.DueDate}&Priority=${values.Priority}&token=${props.token}&id=${props.idList}`,
    });

    await rawResponse.json();
    setVisibleCreate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageTaskCreated")}`, 3);
  };

  const deleteTask = async (taskId) => {
    let rawResponse = await fetch("tasks/delete-task", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `taskId=${taskId}&token=${props.token}&listId=${props.idList}`,
    });

    await rawResponse.json();
    message.info(`${translation(props.language, "MessageTaskDeleted")}`, 3);
    setTrigger(!trigger);
  };

  const markAsDone = async (taskId) => {
    let rawResponse = await fetch("tasks/mark-task-as-done", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `taskId=${taskId}&token=${props.token}&listId=${props.idList}`,
    });

    await rawResponse.json();
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageTaskDone")}`, 3);
  };

  const onFinishDrawerUpdate = async function (values) {
    await fetch("tasks/update-task", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=${values.TaskName}&description=${values.Description}&DueDate=${values.DueDate}&Priority=${values.Priority}&token=${props.token}&listId=${props.idList}&taskId=${idTask}`,
    });

    setVisibleUpdate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageTaskUpdated")}`, 3);
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

  return (
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
            {/* {props.rawLists.length > 0 ? (
                  props.rawLists[props.indexMenu].title
                ) : (
                  <div></div>
                )} */}
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
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
    language: state.language,
    idList: state.idList,
    trigger: state.trigger,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setIdList: function (idList) {
      dispatch({
        type: "setIdList",
        idList: idList,
      });
    },
    setTrigger: function () {
      dispatch({
        type: "setTrigger",
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalContent);
