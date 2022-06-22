export default function (user = "", action) {
  if (action.type == "addUser") {
    var newUser = action.username;
    return newUser;
  } else {
    return user;
  }
}
