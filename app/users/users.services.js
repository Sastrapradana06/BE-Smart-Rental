const { formatDate } = require("../../utils");
const prisma = require("../db/prisma");
const { modifyPenggunaCount, matchIsRole } = require("../roles/roles.services");
const {
  findUsers,
  insertUser,
  deleteUserById,
  deleteUsersRecords,
} = require("./users.repository");
const bcrypt = require("bcryptjs");

const addUsers = async (data) => {
  const { name, email, notel, jekel, alamat, roles } = data;

  await matchIsRole(roles);

  const password = roles.replace(/\s+/g, "") + "123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const dataUser = {
    name,
    email,
    password: hashedPassword,
    notel,
    jekel,
    alamat,
    roles,
  };

  const result = await insertUser(dataUser);
  await modifyPenggunaCount(roles, "increment");

  return result;
};

const deleteUser = async (id) => {
  const deleted = await deleteUserById(id);
  await modifyPenggunaCount(deleted.roles, "decrement");
  return deleted;
};

const deleteUsersIds = async (data) => {
  console.log({ data });

  const ids = data.ids.map((id) => {
    return Number(id);
  });
  console.log({ data, ids });

  const deleted = await deleteUsersRecords(ids);
  return deleted;
};

const getUsers = async () => {
  const get = await findUsers();
  const users = get.map((user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      notel: user.notel,
      jekel: user.jekel,
      alamat: user.alamat,
      roles: user.roles,
      created_at: formatDate(user.created_at),
    };
  });
  return users;
};

module.exports = {
  getUsers,
  addUsers,
  deleteUser,
  deleteUsersIds,
};
