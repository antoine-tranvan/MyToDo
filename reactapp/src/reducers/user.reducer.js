export default function (username = "", action) {
  if (action.type == "addUser") {
    var newUserName = action.username;
    return newUserName;
  } else {
    return username;
  }
}
