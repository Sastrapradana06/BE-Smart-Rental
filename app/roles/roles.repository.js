const prisma = require("../db/prisma");

const findRoles = async () => {
  return await prisma.roles.findMany({
    select: {
      id: true,
      name: true,
      permissions: true,
      pengguna: true,
      color: true,
      created_at: true,
      updated_at: true,
    },
  });
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

const findRoleByName = async (nameRole) => {
  return await prisma.roles.findUnique({
    where: {
      name: nameRole,
    },
  });
};

const findRoleById = async (id) => {
  return await prisma.roles.findUnique({
    where: {
      id,
    },
  });
};

const deleteRoleRecords = async (ids) => {
  return await prisma.roles.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

const updateRole = async (id, dataUpdate) => {
  return await prisma.roles.update({
    where: {
      id,
    },
    data: dataUpdate,
  });
};

module.exports = {
  findRoles,
  updatePenggunaCount,
  insertRole,
  deleteRoleId,
  findRoleByName,
  findRoleById,
  deleteRoleRecords,
  updateRole,
};
