const { randomBytes } = require("crypto");

exports.generateUniqueString = () => {
  const bytes = randomBytes(32);
  return bytes.toString("hex");
};
