const prisma = require("../db/prisma");

const insertUser = async (dataUser) => {
  return await prisma.user.create({
    data: dataUser,
  });
};

const findUsers = async () => {
  return await prisma.user.findMany();
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      notel: true,
      jekel: true,
      alamat: true,
      roles: true,
    },
  });
};

const findUserByRole = async (role) => {
  return await prisma.user.findFirst({
    where: {
      roles: role,
    },
  });
};

const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

const deleteUsersRecords = async (ids) => {
  return await prisma.user.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
};

const updateUser = async (id, newData) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: newData,
  });
};

module.exports = {
  insertUser,
  findUsers,
  findUserByEmail,
  findUserByRole,
  findUserById,
  deleteUserById,
  deleteUsersRecords,
  updateUser,
};
