const express = require("express");
const router = express.Router();

// import valiadte api method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import skill model
const Skill = require("../../model/skill/skill");

// import the validate body data
const validate_change_icon_skill = require("../../controller/middleware/validation/skill/change.icon");

// import upload files method
const upload_files = require("../../controller/utils/upload/upload.files");

// import delete uplaoded files
const delete_uploaded_files = require("../../controller/utils/upload/delete.uploaded.files");

// import delete cloudinar
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import upload cloudinary method
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import the verify token method
const verify_token = require("../../controller/utils/token/verify");

router.put("/", upload_files, async (req, res, next) => {
  try {
    // valiadte body data
    const Error = validate_change_icon_skill(req.body);

    // check if the body is exists
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

    // check if the request has a files or not
    if (!req.files || req.files.length == 0) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you must send an icon",
          }),
          403
        )
      );
    }

    // verify token data
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's token in body is equal id in token
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

    // find teh skill
    const skill = await Skill.findById(req.body.skill_id);

    // check if the skill is exists
    if (!skill) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid skill not found",
          }),
          404
        )
      );
    }

    // upload new icon
    const new_icon = await upload_cloudinary_image(req.files[0], next);

    // delete old icon
    await delete_cloudinary(skill.icon, next);

    // set the icon to skill
    skill.icon = new_icon;

    // save the skill after updated
    await skill.save();

    // delete the uplaoded file (icon)
    delete_uploaded_files(req.files[0], next);

    // create response
    const response = {
      message: {
        english: "Changed successfully",
      },
      new_icon: new_icon,
    };

    //send the resposne to client
    res.status(200).send(response);
  } catch (error) {
    // check if the request has
    if (req.files) {
      // delete the uplaoded file (icon)
      delete_uploaded_files(req.files[0], next);
    }

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
