import React from "react";
import { Layout, Select } from "antd";
import { Link } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { connect } from "react-redux";

const GlobalHeader = ({ welcomeTitle, handleChange }) => {
  const { Option } = Select;

  const { Header } = Layout;

  return (
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
          {welcomeTitle}
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
  );
};

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

export const ConnectedGlobalHeader = connect(
  null,
  mapDispatchToProps
)(GlobalHeader);
