import { translation } from "../I18n/I18n";
import { Layout } from "antd";
import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import GlobalHeader from "../Components/GlobalHeader";
import GlobalSider from "../Components/GlobalSider";
import GlobalContent from "../Components/GlobalContent";

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
      <GlobalHeader
        welcomeTitle={`${translation(props.language, "titre")} ${
          props.username
        } 👋 !`}
        handleChange={handleChange}
      />
      <Layout className="site-layout">
        <GlobalSider />
        <GlobalContent />
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

export default connect(mapStateToProps, null)(Home);
