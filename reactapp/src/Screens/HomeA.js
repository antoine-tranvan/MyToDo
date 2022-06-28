import { translation } from "../I18n/I18n";
import { Layout } from "antd";
import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import { ConnectedGlobalHeader } from "../Components/GlobalHeader";
import { ConnectedGlobalSider } from "./HomeA/Sider";
import { ConnectedGlobalContent } from "./HomeA/Content";

moment.locale("fr");

const Home = (props) => {
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
      <ConnectedGlobalHeader
        welcomeTitle={`${translation(props.language, "titre")} ${
          props.username
        } 👋 !`}
        handleChange={handleChange}
      />
      <Layout className="site-layout">
        <ConnectedGlobalSider />
        <ConnectedGlobalContent />
      </Layout>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
