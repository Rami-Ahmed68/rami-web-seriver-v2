const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin's model
const Admin = require("../../model/admin/admin");

// import compare password method
const compare = require("../../controller/utils/password/compare.js");

// import validate body data method
const validate_login_admin = require("../../controller/middleware/validation/admin/login.js");

// import generate token method
const generate_token = require("../../controller/utils/token/generate.js");

router.post("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_login_admin(req.body);

    // check if the body data has any error
    if (Error.error) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: Error.error.details[0].message,
          }),
          400
        )
      );
    }

    // find the admin by email
    const admin = await Admin.findOne({
      email_address: req.body.email_address,
    });

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid email or password",
          }),
          404
        )
      );
    }

    // compare the passwords
    const comparing_passwords = await compare(
      req.body.password,
      admin.password
    );

    // check if the result is true or false
    if (!comparing_passwords) {
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid email or password",
          }),
          404
        )
      );
    }

    // generate token
    const generated_token = generate_token(admin._id, admin.email_address);

    // create response
    const response = {
      message: {
        english: "Loged in successfully",
      },
      admin_data: _.pick(admin, [
        "_id",
        "name",
        "email_address",
        "avatar",
        "joind_at",
      ]),
      token: generated_token,
    };

    // send the response to client
    res.status(200).send(response);
  } catch (error) {
    // return error
    return next(
      new ApiError(
        JSON.stringify({
          english: `${error}`,
        }),
        500
      )
    );
  }
});

module.exports = router;
