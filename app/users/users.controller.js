const express = require("express");
const { getUsers, addUsers, deleteUser } = require("./users.services");
const router = express.Router();
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  notel: Joi.string().required(),
  jekel: Joi.string().required(),
  alamat: Joi.string().required(),
  roles: Joi.string().required(),
}).strict();

router.get("/", async (req, res) => {
  try {
    const dataUsers = await getUsers();
    res.status(200).json({ message: "Success", data: dataUsers });
  } catch (error) {
    res.status(400).json({ message: "Invalid" });
  }
});

router.post("/", async (req, res) => {
  const { value, error } = registerSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({
      error: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    await addUsers(value);
    res.status(201).json({ message: "Success add user" });
  } catch (error) {
    console.log(error);
    res.status(error.code == "P2002" ? 400 : 500).json({
      message: error.code == "P2002" ? `Email already exists` : error.message,
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

module.exports = router;