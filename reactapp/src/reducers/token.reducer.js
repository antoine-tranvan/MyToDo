export default function (token = "", action) {
  if (action.type == "addToken") {
    var newToken = action.token;
    return newToken;
  } else {
    return token;
  }
}
