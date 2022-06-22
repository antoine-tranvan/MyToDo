export default function (language = "FR", action) {
  if (action.type == "FR") {
    var newLanguage = "FR";
    return newLanguage;
  } else if (action.type == "EN") {
    var newLanguage = "EN";
    return newLanguage;
  } else return language;
}
