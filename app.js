require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

const authController = require("./app/auth/auth.controller");
const rolesController = require("./app/roles/roles.controller");
const usersController = require("./app/users/users.controller");
const unitController = require("./app/unit/unit.controller");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authController);
app.use("/roles", rolesController);
app.use("/users", usersController);
app.use("/unit", unitController);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
