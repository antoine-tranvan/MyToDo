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

module.exports = router;
