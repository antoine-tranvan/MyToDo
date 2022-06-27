export default function (indexMenu = null, action) {
  if (action.type == "setIndexMenu") {
    var newIndexMenu = action.indexMenu;
    return newIndexMenu;
  } else {
    return indexMenu;
  }
}
