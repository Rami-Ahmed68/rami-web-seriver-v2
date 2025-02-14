const Joi = require("joi");

const validate_create_message = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    full_name: Joi.string().required(),
    email_address: Joi.string().required(),
    phone_number: Joi.string().required(),
    whatsapp_number: Joi.string().required(),
    custom_message: Joi.string().required(),
    created_at: Joi.string().required(),
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

module.exports = validate_create_message;
