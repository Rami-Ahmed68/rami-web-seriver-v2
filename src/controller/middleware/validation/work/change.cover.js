const Joi = require("joi");

const validate_change_cover_work = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    work_id: Joi.string().required(),
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

module.exports = validate_change_cover_work;
