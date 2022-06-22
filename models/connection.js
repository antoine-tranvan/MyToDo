var mongoose = require("mongoose");
var dotenv = require("dotenv");
dotenv.config();

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  `mongodb://antoinetranvan:${process.env.ATLAS_PWD}@cluster0-shard-00-00.d792e.mongodb.net:27017,cluster0-shard-00-01.d792e.mongodb.net:27017,cluster0-shard-00-02.d792e.mongodb.net:27017/ToDoList?ssl=true&replicaSet=atlas-1047k8-shard-0&authSource=admin&retryWrites=true&w=majority`,
  options,
  function (error) {
    if (error == null) {
      console.log(`✅Connexion à la base de données réussie.`);
    } else {
      console.log(error);
    }
  }
);
