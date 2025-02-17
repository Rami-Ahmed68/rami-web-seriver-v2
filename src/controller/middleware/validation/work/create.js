const Joi = require("joi");

const validate_create_work = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    web_site_link: Joi.string().required(),
    android_link: Joi.string().required(),
    ios_link: Joi.string().required(),
    type: Joi.string().required(),
    front_end: Joi.string().required(),
    back_end: Joi.string().required(),
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

module.exports = validate_create_work;
