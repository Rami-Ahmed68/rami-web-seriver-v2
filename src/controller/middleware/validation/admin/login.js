const Joi = require("joi");

const validate_login_admin = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    email_address: Joi.string().required(),
    password: Joi.string().required(""),
  });

  // valiadte the data
  const Error = Schema.validate(data);

  // check if the darta has any error
  if (Error.error) {
    // return the error
    return Error;
  } else {
    return false;
  }
};

module.exports = validate_login_admin;
