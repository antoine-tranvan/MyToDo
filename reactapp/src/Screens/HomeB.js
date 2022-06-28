import { translation } from "../I18n/I18n";
import { Layout, message, Select } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import { ListButton } from "../Components/ListButton";
import { ListModal } from "../Components/ListModal";
import { ConnectedGlobalHeader } from "../Components/GlobalHeader";

moment.locale("fr");

const { Header, Content, Footer, Sider } = Layout;

const { Option } = Select;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const HomeB = (props) => {
  const [isModalVisibleCreate, setIsModalVisibleCreate] = useState(false);
  const [rawLists, setRawLists] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [idList, setIdList] = useState("noId");

  useEffect(() => {
    async function loadDataLists() {
      var rawResponse = await fetch("lists/get-lists", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${props.token}`,
      });

      var data = await rawResponse.json();

      let items = data.userLists.map((el, index) => getItem(el.title, index));

      setRawLists(data.userLists);

      if (idList == "noId") {
        setIdList(data.userLists[0]._id);
      }
    }
    loadDataLists();
  }, [trigger]);

  const onFinishCreate = async function (values) {
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

  const handleChange = (value) => {
    if (value == "Français") {
      props.changeLanguageFR();
    } else if (value == "English") {
      props.changeLanguageEN();
    }
    console.log(`selected ${value}`);
  };

  return rawLists.length > 0 ? (
    <Redirect to="/homeA" />
  ) : (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <ConnectedGlobalHeader
        welcomeTitle={`${translation(props.language, "titre")} ${
          props.username
        } 👋 !`}
        handleChange={handleChange}
      />
      <Layout className="site-layout">
        <Sider
          style={{
            backgroundColor: "#f3f3f3",
          }}
        ></Sider>

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
            <div>
              <div>{translation(props.language, "IntroText")}</div>
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
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    token: state.token,
    language: state.language,
    username: state.username,
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeB);
