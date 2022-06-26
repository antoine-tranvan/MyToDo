import { translation } from "../I18n/I18n";
import { LogoutOutlined } from "@ant-design/icons";
import { Layout, message, Select } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import ListButton from "../Components/ListButton";
import ListModal from "../Components/ListModal";

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
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisibleCreate, setIsModalVisibleCreate] = useState(false);
  const [lists, setLists] = useState([]);
  const [rawLists, setRawLists] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [idList, setIdList] = useState("noId");
  const [loading0, setLoading0] = useState(false);
  const [username, setUsername] = useState();

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

  const onFinishCreate = async function (values) {
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

  const onCloseCreate = () => {
    setVisibleCreate(false);
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
    <Redirect to="/home" />
  ) : (
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeB);
