const { formatDate } = require("../../utils");
const { findUserByRole } = require("../users/users.repository");
const {
  findRoles,
  insertRole,
  deleteRoleId,
  updatePenggunaCount,
  findRoleByName,
  findRoleById,
  deleteRoleRecords,
} = require("./roles.repository");

const getAllRoles = async () => {
  const get = await findRoles();

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
  const roles = await findRoleById(id);

  if (!roles) {
    throw new Error("Role not found");
  }

  const isUseRoleUser = await findUserByRole(roles.name);
  console.log({ isUseRoleUser });

  if (isUseRoleUser) {
    throw new Error("Role in use by user");
  }

  const deleted = await deleteRoleId(id);
  return deleted;
};

const deleteRoleIds = async (data) => {
  const ids = data.ids.map((id) => {
    return Number(id);
  });

  let isUseRole = 0;

  const tes = ids.map(async (id) => {
    const getRoles = await findRoleById(id);

    if (getRoles) {
      const getRoleUser = await findUserByRole(getRoles.name);
      if (getRoleUser) {
        return (isUseRole += 1);
      }
    }
  });

  await Promise.all(tes);

  if (isUseRole > 0) {
    throw new Error("roles are still used by users");
  }

  const deleted = await deleteRoleRecords(ids);

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

const getRoleName = async (roleName) => {
  const role = await findRoleByName(roleName);

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
  deleteRoleIds,
  getRoleName,
};
