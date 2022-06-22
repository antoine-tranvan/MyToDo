const FR = require("../I18n/languages/fr");
const EN = require("../I18n/languages/en");

export const translation = (language, key) => {
  if (language === "EN") {
    return EN[key];
  } else if (language === "FR") {
    return FR[key];
  }
};
