const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import work model
const Work = require("../../model/work/work");

// import validate body data method
const validate_create_work = require("../../controller/middleware/validation/work/create");

// import upload files method
const upload_files = require("../../controller/utils/upload/upload.files");

// import delete uploaded files
const delete_uploaded_files = require("../../controller/utils/upload/delete.uploaded.files");

// import upload cloudinary
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import upload cloudinary
const upload_video_cloudinary = require("../../controller/middleware/cloudinary/upload.cloudinary.video");

// import verify token data method
const verify_token = require("../../controller/utils/token/verify");

router.post("/", upload_files, async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_create_work(req.body);

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

    // findthe admin
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
            englihs: "Sorry, invalid admin's data",
          }),
          400
        )
      );
    }

    // create a new work
    const work = new Work({
      title: req.body.title,
      description: req.body.description,
      cover: "",
      video: "",
      images: [],
      web_site_link: req.body.web_site_link,
      android_link: req.body.android_link,
      ios_link: req.body.ios_link,
      type: req.body.type,
      front_end: req.body.front_end.split("split_here"),
      back_end: req.body.back_end.split("split_here"),
      views: 0,
      created_at: req.body.created_at,
    });

    // filter the image of the request'a files
    let images = await req.files.filter((file) => {
      return file.mimetype.startsWith("image");
    });

    // filter the image of the request'a files
    let videos = await req.files.filter((file) => {
      return file.mimetype.startsWith("video");
    });

    // check if the request has any image
    if (images.length > 0) {
      // upload the image file to cloudinary
      for (let i = 0; i < images.length; i++) {
        let uploaded_image = await upload_cloudinary_image(images[i], next);

        // add the uploaded image url into the new work's images
        work.images.push(uploaded_image);
      }
    }

    // check if the request has any video
    if (videos.length > 0) {
      // upload the video file to cloudinary
      let uploaded_video = await upload_video_cloudinary(videos[0], next);

      // set the uploaded video to the created work
      work.video = uploaded_video;
    }

    // save the work in data base
    await work.save();

    // delete uplaoded files
    for (let i = 0; i < req.files.length; i++) {
      delete_uploaded_files(req.files[i], next);
    }

    // create response
    const response = {
      messgae: {
        english: "Created successfully",
      },
      work_data: work,
    };

    // send the resposne to client
    res.status(200).send(response);
  } catch (error) {
    // check if the request has files
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        delete_uploaded_files(req.files[i], next);
      }
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
