const prisma = require("../db/prisma");

const findUnit = async () => {
  return await prisma.unit.findMany();
};

const insertUnit = async (dataUnit) => {
  return await prisma.unit.create({
    data: dataUnit,
  });
};

const findUnitId = async (id) => {
  return await prisma.unit.findUnique({
    where: {
      id,
    },
  });
};

const findUnitPlat = async (plat) => {
  return await prisma.unit.findUnique({
    where: {
      no_plat: plat,
    },
  });
};

const deleteUnit = async (id) => {
  return await prisma.unit.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  findUnit,
  insertUnit,
  findUnitId,
  findUnitPlat,
  deleteUnit,
};
