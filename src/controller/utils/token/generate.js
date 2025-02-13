const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });

const generate_token = (id, email) => {
  return (token = jwt.sign({ _id: id, email: email }, process.env.SECRET_KEY));
};

module.exports = generate_token;
