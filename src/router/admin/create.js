const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import validate body data method
const validate_create_admin = require("../../controller/middleware/validation/admin/create");

// import generate token method
const generate_token = require("../../controller/utils/token/generate");

// import hash password method
const hash = require("../../controller/utils/password/hash");

router.post("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_create_admin(req.body);

    // check if the body data has any error
    if (Error.error) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: `${Error.error.details[0].message}`,
          }),
          400
        )
      );
    }

    // create a admin
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email_address,
      password: await hash(req.body.password),
      work: req.body.work,
      bio: req.body.bio,
      love: req.body.love,
      cv: "",
      avatar: "",
      phone_number: req.body.phone_number,
      whatsapp_number: req.body.whatsapp_number,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      github: req.body.github,
      code_wars: req.body.code_wars,
      joind_at: Date(),
    });

    // generate token
    const generated_token = generate_token(admin._id, admin.email_address);

    // save the created admin in data base
    awaitadmin.save();

    // create response
    const response = {
      message: {
        english: "Admin created successfully",
      },
      admin_data: _.pick(admin, [
        "_id",
        "name",
        "avatar",
        "email_adress",
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
