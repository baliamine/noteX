const bcrypt = require("bcryptjs");

const comparePassword = async (loginPassword, hashedPassword) => {
  return await bcrypt.compare(loginPassword, hashedPassword);
};

module.exports = comparePassword;
