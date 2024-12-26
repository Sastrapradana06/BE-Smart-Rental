const { formatDate } = require("../../utils");
const {
  findRoles,
  insertRole,
  deleteRoleId,
  updatePenggunaCount,
  findRoleByName,
} = require("./roles.repository");

const getAllRoles = async () => {
  const get = await findRoles();

  console.log({ get });

  if (!get) {
    throw new Error("Roles not found");
  }

  if (get.length === 0) {
    return [];
  }

  const roles = get.map((role) => {
    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions,
      pengguna: role.pengguna,
      created_at: formatDate(role.created_at),
      updated_at: formatDate(role.updated_at),
    };
  });

  return roles;
};

const addRole = async (dataRole) => {
  const add = await insertRole(dataRole);
  return add;
};

const deleteRole = async (id) => {
  const deleted = await deleteRoleId(id);
  console.log(deleted);
  return deleted;
};

const modifyPenggunaCount = async (name, type) => {
  const role = await findRoleByName(name);

  if (!role) {
    throw new Error("Role not found");
  }

  const newPengguna =
    type === "increment" ? role.pengguna + 1 : role.pengguna - 1;

  const proccess = await updatePenggunaCount(name, newPengguna);
  return proccess;
};

const matchIsRole = async (name) => {
  const role = await findRoleByName(name);
  console.log({ role });

  if (!role) {
    throw new Error("Role not found");
  }
  return role;
};

module.exports = {
  getAllRoles,
  addRole,
  deleteRole,
  modifyPenggunaCount,
  matchIsRole,
};
