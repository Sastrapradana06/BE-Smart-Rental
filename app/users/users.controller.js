const express = require("express");
const {
  getUsers,
  addUsers,
  deleteUser,
  deleteUsersIds,
  getUserById,
  editUser,
} = require("./users.services");
const router = express.Router();
const Joi = require("joi");
const { authenticateToken } = require("../../middleware");

const addUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  notel: Joi.string().required(),
  jekel: Joi.string().required(),
  alamat: Joi.string().required(),
  roles: Joi.string().required(),
}).strict();

const recordsSchema = Joi.object({
  ids: Joi.array().required(),
}).strict();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const dataUsers = await getUsers();
    res.status(200).json({ status: true, message: "Success", data: dataUsers });
  } catch (error) {
    res.status(400).json({ status: false, message: "Invalid" });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const dataUsers = await getUserById(Number(id));
    res.status(200).json({ status: true, message: "Success", data: dataUsers });
  } catch (error) {
    res.status(400).json({ status: false, message: "Invalid" });
  }
});

router.post("/", async (req, res) => {
  const { value, error } = addUserSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    await addUsers(value);
    res.status(201).json({ status: true, message: "Success add user" });
  } catch (error) {
    console.log(error);
    res.status(error.code == "P2002" ? 400 : 500).json({
      status: false,
      message: error.code == "P2002" ? `Email already exists` : error.message,
    });
  }
});

router.post("/delete-records", async (req, res) => {
  const { value, error } = recordsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    await deleteUsersIds(value);
    res
      .status(200)
      .json({ status: true, message: "Success delete users records" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(Number(id));
    res.status(200).json({ message: "Success delete user" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message:
        error.code === "P2025" ? "User not found" : "Failed to delete user",
    });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { value, error } = addUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    const result = await editUser(Number(id), value);
    res
      .status(200)
      .json({ status: true, message: "Success edit user", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
