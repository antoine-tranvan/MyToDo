export default function (idList = "noId", action) {
  if (action.type == "setIdList") {
    var newIdList = action.idList;
    return newIdList;
  } else {
    return idList;
  }
}
