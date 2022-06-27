export default function (rawLists = [], action) {
  if (action.type == "setRawLists") {
    var newRawLists = [...action.rawLists];
    return newRawLists;
  } else {
    return rawLists;
  }
}
