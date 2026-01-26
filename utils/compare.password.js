const bcrypt = require("bcryptjs");

const comparePassword = async (Password, hashedPassword) => {
  return await bcrypt.compare(Password, hashedPassword);
};

module.exports = comparePassword;
