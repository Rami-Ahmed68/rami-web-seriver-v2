const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// impirt admin model
const Admin = require("../../model/admin/admin");

// import verify token data method
const verify_token = require("../../controller/utils/token/verify");

// import hash password method
const hash = require("../../controller/utils/password/hash");

// import validate body data method
const validate_update_admin = require("../../controller/middleware/validation/admin/update");

router.put("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_update_admin(req.body);

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

    // check if the body has any data for update or not
    if (
      !req.body.name &&
      !req.body.password &&
      !req.body.work &&
      !req.body.bio &&
      !req.body.love &&
      !req.body.facebook &&
      !req.body.instagram &&
      !req.body.phone_number &&
      !req.body.whatsapp_number &&
      !req.body.github &&
      !req.body.code_wars
    ) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you must send a new data to update",
          }),
          403
        )
      );
    }

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin not found",
          }),
          404
        )
      );
    }

    // verify token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token is equal id in body
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin's data",
          }),
          403
        )
      );
    }

    // find and update the admin
    const updated_admin = await Admin.findByIdAndUpdate(
      { _id: req.body.admin_id },
      {
        $set: {
          name: req.body.name ? req.body.name : admin.name,
          work: req.body.work ? req.body.work : admin.work,
          bio: req.body.bio ? req.body.bio.split("split_here") : admin.bio,
          love: req.body.love ? req.body.love : admin.love,
          password: req.body.password
            ? await hash(req.body.password)
            : admin.password,
          phone_number: req.body.phone_number
            ? req.body.phone_number
            : admin.phone_number,
          whatsapp_number: req.body.whatsapp_number
            ? req.body.whatsapp_number
            : admin.whatsapp_number,
          facebook: req.body.facebook ? req.body.facebook : admin.facebook,
          instagram: req.body.instagram ? req.body.instagram : admin.instagram,
          github: req.body.github ? req.body.github : admin.github,
          code_wars: req.body.code_wars ? req.body.code_wars : admin.code_wars,
        },
      },
      {
        new: true,
      }
    );

    // save the admin in data base
    await updated_admin.save();

    // create response
    const response = {
      message: {
        english: "Updated Successfully",
      },
      admin_data: _.pick(updated_admin, ["_id", "name", "work", "bio", "love"]),
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
