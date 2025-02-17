const Joi = require("joi");

const validate_create_work = (data) => {
  // create a Schema
  const Schema = Joi.object().keys({
    admin_id: Joi.string().required(),
    work_id: Joi.string().required(),
    title: Joi.string().allow(""),
    description: Joi.string().allow(""),
    web_site_link: Joi.string().allow(""),
    android_link: Joi.string().allow(""),
    ios_link: Joi.string().allow(""),
    type: Joi.string().allow(""),
    front_end: Joi.string().allow(""),
    back_end: Joi.string().allow(""),
    images_for_delete: Joi.string().allow(""),
    created_at: Joi.string().allow(""),
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
