const Joi = require("joi");

const validate_update_admin = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    name: Joi.string().allow(""),
    password: Joi.string().allow(""),
    work: Joi.string().allow(""),
    bio: Joi.string().allow(""),
    love: Joi.string().allow(""),
    linked_in: Joi.string().allow(""),
    facebook: Joi.string().allow(""),
    instagram: Joi.string().allow(""),
    phone_number: Joi.string().allow(""),
    whatsapp_number: Joi.string().allow(""),
    github: Joi.string().allow(""),
    code_wars: Joi.string().allow(""),
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

module.exports = validate_update_admin;
