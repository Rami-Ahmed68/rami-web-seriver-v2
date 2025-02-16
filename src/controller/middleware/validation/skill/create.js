const Joi = require("joi");

const validate_create_skill = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    name: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
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

module.exports = validate_create_skill;
