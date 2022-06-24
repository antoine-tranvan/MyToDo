var express = require("express");
var router = express.Router();
var userModel = require("../models/users");

var mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

var cron = require("node-cron");

cron.schedule("25 09 * * *", async function () {
  console.log("running a task every minute");
  var user = await userModel.find();

  let countLateTasks = 0;
  console.log(user);

  for (let i = 0; i < user.length; i++) {
    console.log("user", user[i].username);
    if (user[i].lists.length >= 1) {
      for (let j = 0; j < user[i].lists.length; j++) {
        console.log("liste", user[i].lists[j].title);
        if (user[i].lists[j].tasks.length > 0) {
          for (let k = 0; k < user[i].lists[j].tasks.length; k++) {
            console.log("tache", user[i].lists[j].tasks[k].title);
            console.log("duedate", user[i].lists[j].tasks[k].dueDate.getTime());
            console.log("date du jour", Date.now());
            if (
              user[i].lists[j].tasks[k].dueDate.getTime() < Date.now() &&
              user[i].lists[j].tasks[k].status == "Pas commencé"
            ) {
              countLateTasks = countLateTasks + 1;
              console.log("la comparaison marche");
            }
          }
        }
      }
    }
    if (countLateTasks > 0) {
      console.log("envoi email en retard");
      function getMessage() {
        const body =
          "You have late task(s) that were supposed to be already completed by now !";
        return {
          to: `${user[i].email}`,
          from: "antoine.tranvan@gmail.com",
          subject: "[MyToDo] You have late tasks !",
          text: body,
          html: `<div>Dear ${user[i].username},</div><div>${body}</div><div>Go on https://obscure-anchorage-03900.herokuapp.com/ to check them out !</div><div>The MyToDo Team</div>`,
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
    countLateTasks = 0;
  }
});

module.exports = router;
