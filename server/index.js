const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
require("./config/database").server();

app.listen(PORT, () => {
  console.log("Server Started Successfully");
});
