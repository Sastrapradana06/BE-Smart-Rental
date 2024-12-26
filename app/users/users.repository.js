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

const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  insertUser,
  findUsers,
  findUserByEmail,
  deleteUserById,
};
