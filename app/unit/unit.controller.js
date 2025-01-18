const env = require("dotenv").config();
const express = require("express");
const {
  getAllUnit,
  addUnit,
  getUnitUniqe,
  deleteUnitId,
} = require("./unit.services");
const router = express.Router();
const Joi = require("joi");

const unitSchema = Joi.object({
  nama: Joi.string().required(),
  no_plat: Joi.string().required(),
  tahun: Joi.string().required(),
  jenis: Joi.string().required(),
  transmisi: Joi.string().required(),
  jumlah_pintu: Joi.number().required(),
  jumlah_kursi: Joi.number().required(),
  harga: Joi.number().required(),
  jumlah_total: Joi.number().required(),
  jumlah_tersedia: Joi.number().required(),
  jumlah_disewa: Joi.number().default(0),
}).strict();

router.get("/", async (req, res) => {
  try {
    const result = await getAllUnit();
    res.status(200).json({ status: true, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: res.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { value, error } = unitSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      error: `${error.details.map((detail) => detail.message)}`,
    });
  }

  try {
    const result = await addUnit(value);
    res
      .status(200)
      .json({ status: true, message: "Success add unit", data: result });
  } catch (error) {
    console.log(error);
    res.status(error.code == "P2002" ? 400 : 500).json({
      status: false,
      message:
        error.code == "P2002"
          ? "Nomor plat has been used"
          : "Failed to add unit",
    });
  }
});

router.get("/:key", async (req, res) => {
  let { key } = req.params;

  if (!key) {
    return res.status(400).json({
      status: false,
      message: "Key is required",
    });
  }

  if (!key.includes(" ")) {
    key = Number(key);
  }

  console.log(key);

  try {
    const result = await getUnitUniqe(key);
    res.status(200).json({ status: true, message: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUnitId(Number(id));
    res.status(200).json({ status: true, message: "Success delete unit" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: error.message });
  }
});

module.exports = router;
