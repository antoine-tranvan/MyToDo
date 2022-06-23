var express = require("express");
var router = express.Router();
var userModel = require("../models/users");

var mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.json({ title: "Express" });
});

router.post("/create-task", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  var updatedUser = user[0];

  console.log("date", req.body.DueDate);

  creationCheck = 0;

  for (let i = 0; i < updatedUser.lists.length; i++) {
    if (updatedUser.lists[i]._id == req.body.id) {
      creationCheck = 1;
      updatedUser.lists[i].tasks.push({
        title: req.body.TaskName,
        description: req.body.description,
        dueDate: req.body.DueDate,
        priority: req.body.Priority,
        status: "Pas commencé",
      });
    }
  }

  console.log("creation check", creationCheck);
  if (creationCheck == 0) {
    updatedUser.lists[0].tasks.push({
      title: req.body.TaskName,
      description: req.body.description,
      dueDate: req.body.DueDate,
      priority: req.body.Priority,
      status: "Pas commencé",
    });
  }

  var userSaved = await updatedUser.save();

  res.json({ result: "ok" });
});

router.post("/get-tasks", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  console.log("listid", req.body.listId);

  var taskslist = [];
  if (req.body.listId == "noId") {
    taskslist.push(user[0].lists[0]);
    console.log("coucou ca marche");
  } else {
    taskslist = user[0].lists.filter((el) => el._id == req.body.listId);
  }

  console.log("tasks", user[0].lists[0]);
  console.log("taskslist", taskslist);
  res.json({ taskslist });
});

router.post("/delete-task", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  var updatedUser = user[0];

  console.log("updatedUser", updatedUser);

  for (let i = 0; i < updatedUser.lists.length; i++) {
    if (updatedUser.lists[i]._id == req.body.listId) {
      await updatedUser.lists[i].tasks.id(req.body.taskId).remove();
    }
  }

  var userSaved = await updatedUser.save();

  console.log(userSaved);

  res.json({ userSaved });
});

router.post("/update-task", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  var updatedUser = user[0];

  console.log("updatedUser", updatedUser);

  for (let i = 0; i < updatedUser.lists.length; i++) {
    if (updatedUser.lists[i]._id == req.body.listId) {
      updatedUser.lists[i].tasks.id(req.body.taskId).title = req.body.title;
      updatedUser.lists[i].tasks.id(req.body.taskId).description =
        req.body.description;
      updatedUser.lists[i].tasks.id(req.body.taskId).dueDate = req.body.dueDate;
      updatedUser.lists[i].tasks.id(req.body.taskId).priority =
        req.body.Priority;
    }
  }

  var userSaved = await updatedUser.save();

  console.log(userSaved);

  res.json({ userSaved });
});

router.post("/mark-task-as-done", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  var updatedUser = user[0];

  for (let i = 0; i < updatedUser.lists.length; i++) {
    if (updatedUser.lists[i]._id == req.body.listId) {
      updatedUser.lists[i].tasks.id(req.body.taskId).status = "Terminé";
    }
  }

  let countFinishedTasks = 0;
  let countTaskNumber = 0;
  for (let i = 0; i < updatedUser.lists.length; i++) {
    if (updatedUser.lists[i]._id == req.body.listId) {
      countTaskNumber = updatedUser.lists[i].tasks.length;
      for (let j = 0; j < updatedUser.lists[i].tasks.length; j++) {
        if (updatedUser.lists[i].tasks[j].status == "Terminé") {
          countFinishedTasks = countFinishedTasks + 1;
        }
      }
    }
  }

  var userSaved = await updatedUser.save();

  console.log(userSaved);
  console.log("count", countFinishedTasks);
  console.log("count", countTaskNumber);

  if (countFinishedTasks == countTaskNumber) {
    function getMessage() {
      const body = "Well done ! You have worked hard!";
      return {
        to: `${userSaved.email}`,
        from: "antoine.tranvan@gmail.com",
        subject: "Your list of task is completed ! !",
        text: body,
        html: `<strong>${body}</strong>`,
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

  res.json({ userSaved });
});

module.exports = router;
