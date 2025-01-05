const { formatDate } = require("../../utils");
const prisma = require("../db/prisma");
const { modifyPenggunaCount, matchIsRole } = require("../roles/roles.services");
const {
  findUsers,
  insertUser,
  deleteUserById,
  deleteUsersRecords,
  findUserById,
  updateUser,
} = require("./users.repository");
const bcrypt = require("bcryptjs");

const getUserById = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

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
  await modifyPenggunaCount(roles, 1);

  return result;
};

const deleteUser = async (id) => {
  const deleted = await deleteUserById(id);
  await modifyPenggunaCount(deleted.roles, "decrement");
  return deleted;
};

// const deleteUsersIds = async (data) => {
//   const ids = data.ids.map((id) => {
//     return Number(id);
//   });

//   const handleCount = ids.map(async (id) => {
//     const getUser = await findUserById(id);
//     console.log({ getUser });

//     if (getUser) {
//       await modifyPenggunaCount(getUser.roles, "decrement");
//     }
//   });

//   await Promise.all(handleCount);

//   const deleted = await deleteUsersRecords(ids);
//   return deleted;
// };

const deleteUsersIds = async (data) => {
  const ids = data.ids.map(Number);

  const users = await Promise.all(ids.map((id) => findUserById(id)));

  const roleCounts = {};
  users.forEach((user) => {
    if (user) {
      roleCounts[user.roles] = (roleCounts[user.roles] || 0) - 1;
    }
  });

  await Promise.all(
    Object.entries(roleCounts).map(([role, count]) =>
      modifyPenggunaCount(role, count)
    )
  );

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

const editUser = async (id, data) => {
  const edit = await updateUser(id, data);
  return edit;
};

module.exports = {
  getUsers,
  addUsers,
  deleteUser,
  deleteUsersIds,
  getUserById,
  editUser,
};
