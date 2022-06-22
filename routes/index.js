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

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.json({ title: "Express" });
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
  }
  console.log("userSaved", userSaved);

  function getMessage() {
    const body = "Welcome and have fun!";
    return {
      to: `${userSaved.email}`,
      from: "antoine.tranvan@gmail.com",
      subject: "Thank you for Signing Up to our TODO Webapp !",
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

router.post("/create-list", async function (req, res, next) {
  var updatedUser = await userModel.updateOne(
    { token: req.body.token },
    {
      $push: {
        lists: {
          title: req.body.ListName,
          description: req.body.description,
          tasks: [],
        },
      },
    }
  );

  console.log(updatedUser);

  res.json({ result: "ok" });
});

router.post("/get-lists", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });

  if (user) {
    var userLists = user[0].lists;
  }

  res.json({ userLists: userLists, user: user[0].username });
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
        priority: "High",
        status: "Not started",
      });
    }
  }

  console.log("creation check", creationCheck);
  if (creationCheck == 0) {
    updatedUser.lists[0].tasks.push({
      title: req.body.TaskName,
      description: req.body.description,
      dueDate: req.body.DueDate,
      priority: "High",
      status: "Not started",
    });
  }

  var userSaved = await updatedUser.save();

  res.json({ result: "ok" });
});

router.post("/delete-list", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  var updatedUser = user[0];

  var countcheck = 0;

  for (var i = 0; i < updatedUser.lists.length; i++) {
    if (updatedUser.lists[i]._id == req.body.listId) {
      countcheck = 1;
    }
  }

  if (countcheck == 1) {
    updatedUser.lists.id(req.body.listId).remove();
  }

  var userSaved = await updatedUser.save();

  res.json({ userSaved, countcheck });
});

router.post("/update-list", async function (req, res, next) {
  var user = await userModel.find({ token: req.body.token });
  var updatedUser = user[0];

  updatedUser.lists.id(req.body.listId).title = req.body.title;
  updatedUser.lists.id(req.body.listId).description = req.body.description;

  var userSaved = await updatedUser.save();

  res.json({ userSaved });
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
