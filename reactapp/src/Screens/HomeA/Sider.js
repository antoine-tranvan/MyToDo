import { translation } from "../../I18n/I18n";
import { Layout, Menu, message } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "moment/locale/fr";
import { ListButton } from "../../Components/ListButton";
import { ListModal } from "../../Components/ListModal";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const GlobalSider = (props) => {
  const [isModalVisibleCreate, setIsModalVisibleCreate] = useState(false);
  const [lists, setLists] = useState([]);
  const [rawLists, setRawLists] = useState([]);
  const [idList, setIdList] = useState("noId");
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    async function loadDataLists() {
      var rawResponse = await fetch("lists/get-lists", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}`,
      });

      var data = await rawResponse.json();

      let items = data.userLists.map((el, index) => getItem(el.title, index));

      setLists(items);
      setRawLists(data.userLists);
      props.setRawLists(data.userLists);

      if (idList == "noId") {
        setIdList(data.userLists[0]._id);
      }
    }
    loadDataLists();
  }, [trigger, props.trigger]);

  const onFinishCreate = async function (values) {
    console.log("Success:", values.ListName, props.token);

    let rawResponse = await fetch("lists/create-list", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `ListName=${values.ListName}&description=${values.Description}&token=${props.token}`,
    });

    await rawResponse.json();
    setIsModalVisibleCreate(false);
    setTrigger(!trigger);
    message.info(`${translation(props.language, "MessageListCreated")}`, 3);
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onClick = ({ item, key }) => {
    props.setIdList(rawLists[key]._id);
    props.setIndexMenu(key);
    console.log(key);
    setTrigger(!trigger);
  };

  return (
    <Sider
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
    setIndexMenu: function (indexMenu) {
      dispatch({
        type: "setIndexMenu",
        indexMenu: indexMenu,
      });
    },
    setRawLists: function (rawLists) {
      dispatch({
        type: "setRawLists",
        rawLists: rawLists,
      });
    },
  };
}

export const ConnectedGlobalSider = connect(
  mapStateToProps,
  mapDispatchToProps
)(GlobalSider);
