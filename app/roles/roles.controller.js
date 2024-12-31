const env = require("dotenv").config();

const express = require("express");
const {
  getAllRoles,
  addRole,
  deleteRole,
  deleteRoleIds,
  getRoleName,
  getRoleId,
  editRole,
} = require("./roles.services");
const router = express.Router();
const Joi = require("joi");
const { authenticateToken } = require("../../middleware");

const rolesSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().required(),
  pengguna: Joi.number().required(),
  color: Joi.string().required(),
}).strict();

const recordsSchema = Joi.object({
  ids: Joi.array().required(),
}).strict();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await getAllRoles();

    res.status(200).json({ status: true, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.get("/:name", authenticateToken, async (req, res) => {
  const { name } = req.params;
  try {
    const result = await getRoleName(name.toLocaleLowerCase());
    res.status(200).json({ status: true, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.get("/id/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getRoleId(Number(id));
    res.status(200).json({ status: true, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { value, error } = rolesSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      error: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    await addRole(value);
    res.status(200).json({ status: true, message: "Success add role" });
  } catch (error) {
    console.log(error);
    res.status(error.code == "P2002" ? 400 : 500).json({
      status: false,
      message:
        error.code == "P2002" ? "Role already exists" : "Failed to add role",
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
    await deleteRoleIds(value);
    res.status(200).json({ status: true, message: "Success delete role" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.code === "P2025" ? "Role not found" : error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteRole(Number(id));
    res.status(200).json({ status: true, message: "Success delete role" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: error.code === "P2025" ? "Role not found" : error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { value, error } = rolesSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      error: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    await editRole(Number(id), value);
    res.status(200).json({ status: true, message: "Success edit role" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: res.message,
    });
  }
});

module.exports = router;
