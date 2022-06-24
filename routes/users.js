var express = require("express");
var router = express.Router();
var userModel = require("../models/users");
var bcrypt = require("bcrypt");
var uid2 = require("uid2");
var mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
let nodemailer = require("nodemailer");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", async function (req, res, next) {
  var results = true;
  var errorMessage = "";
  var userCheck = await userModel.findOne({ email: req.body.email });

  var hash = bcrypt.hashSync(req.body.password, 10);

  if (
    req.body.email == "" ||
    req.body.username == "" ||
    req.body.password == ""
  ) {
    results = false;
    errorMessage = "Il faut remplir tous les champs";
  } else if (userCheck) {
    results = false;
    errorMessage = "Vous avez déjà un compte";
  } else {
    var newUser = new userModel({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      token: uid2(32),
      lists: [],
    });

    var userSaved = await newUser.save();

    function getMessage() {
      const body = "Welcome and have fun with MyToDo app!";
      return {
        to: `${userSaved.email}`,
        from: "antoine.tranvan@gmail.com",
        subject: "[MyToDo]Thank you for Signing Up to MyToDo Webapp !",
        text: body,
        html: `<div>Dear ${userSaved.username},</div><div>${body}</div><div>The MyToDo Team</div>`,
      };
    }

    async function sendEmail() {
      try {
        await sendGridMail.send(getMessage());
        console.log("Test email sent successfully");
      } catch (error) {
        console.error("Error sending test email");
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    }

    (async () => {
      console.log("Sending test email");
      await sendEmail();
    })();
  }

  res.json({ results, errorMessage, userSaved });
});

router.post("/sign-in", async function (req, res, next) {
  var results = false;
  var errorMessage = true;
  var passwordCheck = false;

  var userCheck = await userModel.findOne({ email: req.body.email });

  if (userCheck == undefined) {
    results = false;
    errorMessage = "Le compte n'existe pas";
  } else if (!bcrypt.compareSync(req.body.password, userCheck.password)) {
    results = false;
    errorMessage = "Le mot de passe est erroné";
  } else {
    results = true;
  }

  res.json({ results, errorMessage, userCheck });
});

module.exports = router;
