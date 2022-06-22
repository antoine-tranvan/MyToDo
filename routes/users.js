var express = require("express");
var router = express.Router();
var userModel = require("../models/users");
var bcrypt = require("bcrypt");
var uid2 = require("uid2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
