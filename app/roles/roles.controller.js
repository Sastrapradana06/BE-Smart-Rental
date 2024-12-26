const env = require("dotenv").config();

const express = require("express");
const { getAllRoles, addRole, deleteRole } = require("./roles.services");
const router = express.Router();
const Joi = require("joi");

const rolesSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().required(),
  pengguna: Joi.number().required(),
}).strict();

router.get("/", async (req, res) => {
  try {
    const result = await getAllRoles();
    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { value, error } = rolesSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    await addRole(value);
    res.status(200).json({ message: "Success add role" });
  } catch (error) {
    console.log(error);
    res.status(error.code == "P2002" ? 400 : 500).json({
      message:
        error.code == "P2002" ? "Role already exists" : "Failed to add role",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteRole(Number(id));
    res.status(200).json({ message: "Success delete role" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message:
          error.code === "P2025" ? "Role not found" : "Failed to delete role",
      });
  }
});

module.exports = router;
