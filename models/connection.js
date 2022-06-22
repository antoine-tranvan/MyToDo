var mongoose = require("mongoose");
var dotenv = require("dotenv");
dotenv.config();

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  `mongodb+srv://antoinetranvan:${process.env.ATLAS_PWD}@cluster0.d792e.mongodb.net/ToDoList?retryWrites=true&w=majority`,
  options,
  function (error) {
    if (error == null) {
      console.log(`✅Connexion à la base de données réussie.`);
    } else {
      console.log(error);
    }
  }
);
