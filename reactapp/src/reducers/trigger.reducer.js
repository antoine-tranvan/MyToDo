export default function (trigger = false, action) {
  if (action.type == "setTrigger") {
    var newTrigger = !trigger;
    return newTrigger;
  } else {
    return trigger;
  }
}
