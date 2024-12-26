const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { formatDate } = require("../../utils");
const { insertUser, findUserByEmail } = require("../users/users.repository");

const registerUser = async (dataUser) => {
  const { name, email, password, notel, jekel, alamat, roles } = dataUser;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await insertUser({
    name,
    email,
    password: hashedPassword,
    notel,
    jekel,
    alamat,
    roles,
  });

  return result;
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  console.log({ user });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  if (!token) {
    throw new Error("Failed to generate token");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      notel: user.notel,
      jekel: user.jekel,
      alamat: user.alamat,
      roles: user.roles,
      created_at: formatDate(user.created_at),
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
