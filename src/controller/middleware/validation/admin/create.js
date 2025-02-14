const Joi = require("joi");

const validate_create_admin = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    name: Joi.string().required(),
    email_address: Joi.string().required(),
    password: Joi.string().required(),
    work: Joi.string().required(),
    bio: Joi.string().required(),
    love: Joi.string().required(),
    facebook: Joi.string().required(),
    instagram: Joi.string().required(),
    phone_number: Joi.string().required(),
    whatsapp_number: Joi.string().required(),
    github: Joi.string().required(),
    code_wars: Joi.string().required(),
    joind_at: Joi.string().required(),
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

module.exports = validate_create_admin;
