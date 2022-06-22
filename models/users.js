var mongoose = require("mongoose");

var tasksSchema = mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  status: String,
});

var listsSchema = mongoose.Schema({
  title: String,
  description: String,
  tasks: [tasksSchema],
});

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  lists: [listsSchema],
});
var userModel = mongoose.model("users", userSchema);

module.exports = userModel;
