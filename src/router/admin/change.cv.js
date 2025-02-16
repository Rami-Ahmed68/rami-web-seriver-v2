const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import the admin model
const Admin = require("../../model/admin/admin");

// import validate body data
const validate_change_cv_admin = require("../../controller/middleware/validation/admin/change_cv");

// import upload_files method
const upload_files = require("../../controller/utils/upload/upload.files");

// import upload image to cloudinary
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import delete image to cloudinary
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import delete files method
const delete_files = require("../../controller/utils/upload/delete.files");

// import verify token method
const verify_token = require("../../controller/utils/token/verify");

router.put("/", upload_files, async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_change_cv_admin(req.body);

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

    // check if the requets has more than one file
    if (req.files && req.files.length > 1) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you cann't upload more than on file",
          }),
          403
        )
      );
    } else if (!req.files) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you should send one image as a cv",
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

    // check if the admin is alrady has an cv
    if (admin.cv != "") {
      // delete the old cv
      await delete_cloudinary(admin.cv, next);
    }

    // upload the cv
    const new_cv = await upload_cloudinary_image(req.files[0], next);

    // set the new avatar's url to admin
    admin.avatar = new_cv;

    // save the avatra after updated the avatar
    await admin.save();

    // delete the uploaded avatar from fiels folder
    delete_files(req.files[0], next);

    // create response
    const response = {
      message: {
        english: "Changed successfully",
      },
      new_cv: new_cv,
    };

    // send the response to client
    res.status(200).send(response);
  } catch (error) {
    // check if the request has any images file
    if (req.files) {
      // delete the uploaded cv from fiels folder
      delete_files(req.files[0], next);
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
