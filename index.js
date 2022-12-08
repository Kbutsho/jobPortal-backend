const { cyan, bold } = require("colorette");
const app = require("./app");
const database = require("./database/database");
require("dotenv").config();

database();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(cyan(bold("Server is running on PORT " + port + " !")));
});
