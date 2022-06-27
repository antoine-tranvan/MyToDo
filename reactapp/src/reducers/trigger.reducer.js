export default function (trigger = false, action) {
  console.log(trigger);
  if (action.type == "setTrigger") {
    var newTrigger = !trigger;
    return newTrigger;
  } else {
    return trigger;
  }
}
