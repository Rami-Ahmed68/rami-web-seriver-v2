const Joi = require("joi");

const validate_delete_skill = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    skill_id: Joi.string().required(),
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

module.exports = validate_delete_skill;
