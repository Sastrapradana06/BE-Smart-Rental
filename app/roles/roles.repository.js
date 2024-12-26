const prisma = require("../db/prisma");

const findRoles = async () => {
  return await prisma.roles.findMany();
};

const insertRole = async (dataRole) => {
  return await prisma.roles.create({
    data: dataRole,
  });
};

const deleteRoleId = async (id) => {
  return await prisma.roles.delete({
    where: {
      id,
    },
  });
};

const updatePenggunaCount = async (name, count) => {
  return await prisma.roles.update({
    where: {
      name,
    },
    data: {
      pengguna: count,
    },
  });
};

const findRoleByName = async (name) => {
  return await prisma.roles.findUnique({
    where: {
      name,
    },
  });
};

module.exports = {
  findRoles,
  updatePenggunaCount,
  insertRole,
  deleteRoleId,
  findRoleByName,
};
