const express = require("express");
const { method } = require("lodash");
const router = express.Router();

// import validate api error
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import skill model
const Skill = require("../../model/skill/skill");

// import validate body data
const validate_create_skill = require("../../controller/middleware/validation/skill/create");

// import uplaode files method
const upload_files = require("../../controller/utils/upload/upload.files");

// import upload image to cloudinary
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import delete uploaded files method
const delete_uploaded_files = require("../../controller/utils/upload/delete.uploaded.files");

// import verify token method
const verify_token = require("../../controller/utils/token/verify");

router.post("/", upload_files, async (req, res, next) => {
  try {
    // valiadte body data
    const Error = validate_create_skill(req.body);

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

    // find the admin
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return the error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin not found",
          }),
          404
        )
      );
    }

    // verify the token
    const verify_token_data = await verify_token(
      req.headers.authorization,
      next
    );

    // check if the admin's id in token is equal id in body
    if (req.body.admin_id != verify_token_data._id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin's data",
          }),
          404
        )
      );
    }

    // craete new skill
    const skill = new Skill({
      title: req.body.title,
      description: req.body.description,
      icon: "",
      created_at: req.body.created_at,
    });

    // uplod the icon to cloudinary
    const icon_url = await upload_cloudinary_image(req.files[0], next);

    // set the icon_url to created skill
    skill.icon = icon_url;

    // save the skill
    await skill.save();

    // delete uplaoded file
    delete_uploaded_files(req.files[0], next);

    // create response
    const response = {
      message: {
        english: "Created Successfully",
      },
      skill_data: skill,
    };

    // send the resonse
    res.status(200).send(response);
  } catch (error) {
    // delete uplaoded file
    delete_uploaded_files(req.files[0], next);

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
