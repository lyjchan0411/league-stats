const express = require("express");
const cors = require("cors");
const users = require("./routes/users");
const matches = require("./routes/matches");
require("dotenv").config();

const app = express();
app.use(cors());
const { PORT } = process.env;

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/users", users);
app.use("/matches", matches);

app.listen(PORT, () => {
  console.log("Server is running on" + ` ` + PORT);
});
