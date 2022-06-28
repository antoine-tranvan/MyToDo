export default function (indexMenu = 0, action) {
  if (action.type == "setIndexMenu") {
    var newIndexMenu = action.indexMenu;
    return newIndexMenu;
  } else {
    return indexMenu;
  }
}
