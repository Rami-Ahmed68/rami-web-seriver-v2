const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import work model
const Work = require("../../model/work/work");

// import validate body data method
const validate_change_video_work = require("../../controller/middleware/validation/work/change.video");

// import verify token method
const verify_token = require("../../controller/utils/token/verify");

// import upload files method
const upload_files = require("../../controller/utils/upload/upload.files");

// import delete uploaded files method
const delete_uploaded_files = require("../../controller/utils/upload/delete.uploaded.files");

// import upload cloudinary method
const upload_video_cloudinary = require("../../controller/middleware/cloudinary/upload.cloudinary.video");

// import delete cloudinary
const delete_cloudinary_video = require("../../controller/middleware/cloudinary/delete.cloudinary.video");

router.put("/", upload_files, async (req, res, next) => {
  try {
    // valiadte body data
    const Error = validate_change_video_work(req.body);

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

    // check if the request has a file
    if (!req.files) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you must send a new video for update",
          }),
          403
        )
      );
    }

    // check if the request has more than one file
    if (req.files && req.files.length > 1) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you cann't upload more than one video",
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

    // check if the admin's id in body is equal id in token
    if (verify_token_data._id != req.body.admin_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin's data",
          }),
          400
        )
      );
    }

    // find teh work
    const work = await Work.findById(req.body.work_id);

    // check if the wor is exists
    if (!work) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid work not found",
          }),
          404
        )
      );
    }

    // check if the work has a video
    if (work.video != "") {
      // uploade new video
      const new_video = await upload_video_cloudinary(req.files[0], next);

      // delete old video
      await delete_cloudinary_video(work.video, next);

      // set the uploade new video to work
      work.video = new_video;
    }

    // delete the uplaoded files
    delete_uploaded_files(req.files[0], next);

    // save the work after updated the video
    await work.save();

    // create response
    const response = {
      message: {
        english: "Changed successfully",
      },
      new_video: work.video,
    };

    // send teh response to client
    res.status(200).send(response);
  } catch (error) {
    // delete the uploaded files
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
