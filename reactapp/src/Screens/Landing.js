import React, { useState } from "react";
import "../App.css";
import { Input, Button, message, Alert } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

function ScreenHome(props) {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUp, setSignUp] = useState(true);
  const [signIn, setSignIn] = useState(true);
  const [isLogin, setIsLogin] = useState();
  const [signInPassword, setSignInPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");

  async function handleSubmitSignUp() {
    var rawResponse = await fetch("users/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${signUpUsername}&email=${signUpEmail}&password=${signUpPassword}`,
    });
    var response = await rawResponse.json();

    console.log("response", response);

    setIsLogin(response.results);
    setSignUp(response.results);

    if (response.results == true) {
      message.success("Login réussi", 3);
      props.addToken(response.userSaved.token);
      props.addUser(response.userSaved.username);
    } else {
      message.error(response.errorMessage, 3);
    }
  }

  async function handleSubmitSignIn() {
    var rawResponse = await fetch("users/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `email=${signInEmail}&password=${signInPassword}`,
    });
    var response = await rawResponse.json();

    console.log("response coucou", response);

    setIsLogin(response.results);
    setSignIn(response.results);

    if (response.results == true) {
      message.success("Login réussi", 3);
      props.addToken(response.userCheck.token);
      props.addUser(response.userCheck.username);
    } else if (response.results == false) {
      message.error(response.errorMessage, 3);
    }
  }

  if (isLogin == true) {
    return <Redirect to="/homeB" />;
  } else {
    return (
      <div className="Login-page">
        {/* SIGN-IN */}

        <div className="Sign">
          <div style={{ fontSize: "20px", marginBottom: "5px" }}>
            Se connecter
          </div>
          <Input
            onChange={(e) => setSignInEmail(e.target.value)}
            value={signInEmail}
            className="Login-input"
            placeholder="arthur@gmail.com"
            type="email"
            status="error"
            required
          />

          <Input.Password
            onChange={(e) => setSignInPassword(e.target.value)}
            value={signInPassword}
            className="Login-input"
            placeholder="password"
            type="password"
            required
          />

          <Button
            onClick={() => handleSubmitSignIn()}
            style={{ width: "80px" }}
            type="primary"
          >
            Sign-in
          </Button>
        </div>

        {/* SIGN-UP */}

        <div className="Sign">
          <div style={{ fontSize: "20px", marginBottom: "5px" }}>
            S'inscrire
          </div>
          <Input
            onChange={(e) => setSignUpUsername(e.target.value)}
            value={signUpUsername}
            className="Login-input"
            placeholder="Arthur G"
            required
          />
          <Input
            onChange={(e) => setSignUpEmail(e.target.value)}
            value={signUpEmail}
            className="Login-input"
            placeholder="arthur.g@gmail.com"
            type="email"
            required
          />

          <Input.Password
            onChange={(e) => setSignUpPassword(e.target.value)}
            value={signUpPassword}
            className="Login-input"
            placeholder="password"
            type="password"
            required
          />

          <Button
            onClick={() => handleSubmitSignUp()}
            style={{ width: "80px" }}
            type="primary"
          >
            Sign-up
          </Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addToken: function (token) {
      dispatch({
        type: "addToken",
        token: token,
      });
    },
    addUser: function (username) {
      dispatch({
        type: "addUser",
        username: username,
      });
    },
  };
}

export default connect(null, mapDispatchToProps)(ScreenHome);
