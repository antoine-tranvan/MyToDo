var express = require("express");
var router = express.Router();

const dotenv = require("dotenv");
dotenv.config();
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.json({ title: "Express" });
});

module.exports = router;
