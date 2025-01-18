const {
  findUnit,
  insertUnit,
  findUnitPlat,
  findUnitId,
  deleteUnit,
} = require("./unit.repository");

const getAllUnit = async () => {
  const units = await findUnit();
  return units;
};

const addUnit = async (data) => {
  const unit = await insertUnit(data);
  return unit;
};

const getUnitUniqe = async (uniqe) => {
  if (typeof uniqe === "string") {
    const unitPlat = await findUnitPlat(uniqe);
    if (!unitPlat) {
      throw new Error("Unit not found");
    }
    return unitPlat;
  }

  const unitId = await findUnitId(uniqe);
  if (!unitId) {
    throw new Error("Unit not found");
  }
  return unitId;
};

const deleteUnitId = async (id) => {
  await getUnitUniqe(Number(id));
  return await deleteUnit(id);
};

module.exports = {
  getAllUnit,
  addUnit,
  getUnitUniqe,
  deleteUnitId,
};
