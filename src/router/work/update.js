const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import work model
const Work = require("../../model/work/work");

// import validate body data method
const validate_update_work = require("../../controller/middleware/validation/work/update");

// import upload files method
const upload_files = require("../../controller/utils/upload/upload.files");

// import delete uploade files method
const delete_uploaded_files = require("../../controller/utils/upload/delete.uploaded.files");

// import uploade images cloudinary method
const upload_cloudinary_image = require("../../controller/middleware/cloudinary/upload.cloudinary.image");

// import delete cloudinary method
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import verify token metho
const verify_token = require("../../controller/utils/token/verify");

router.put("/", upload_files, async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_update_work(req.body);

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

    // check if the request has any new data
    if (
      !req.body.title &&
      !req.body.description &&
      !req.body.web_site_link &&
      !req.body.android_link &&
      !req.body.ios_link &&
      !req.body.type &&
      !req.body.front_end &&
      !req.body.back_end &&
      !req.body.created_at &&
      !req.body.images_for_delete
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

    // find teh admin
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
          400
        )
      );
    }

    // find the work
    const work = await Work.findById(req.body.work_id);

    // check if the work is exists
    if (!work) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            englihs: "Sorry, invalid work not found",
          }),
          404
        )
      );
    }

    // find and update
    const updated_work = await Work.findByIdAndUpdate(
      { _id: req.body.work_id },
      {
        $set: {
          title: req.body.title ? req.body.title : work.title,
          description: req.body.description
            ? req.body.description
            : work.description,
          web_site_link: req.body.web_site_link
            ? req.body.web_site_link
            : wrk.web_site_link,
          android_link: req.body.android_link
            ? req.body.android_link
            : work.android_link,
          ios_link: req.body.ios_link ? req.body.ios_link : work.ios_link,
          type: req.body.type ? req.body.type : work.type,
          front_end: req.body.front_end
            ? req.body.front_end.split("split_here")
            : work.front_end,
          back_end: req.body.back_end
            ? req.body.back_end.split("split_here")
            : work.back_end,
          images: work.images,
          created_at: req.body.created_at
            ? req.body.created_at
            : work.created_at,
        },
      },
      { new: true }
    );

    // check if the request has an files or not
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploaded_image = await upload_cloudinary_image(
          req.files[i],
          next
        );

        // push the uploaded image's url to updated work's images array
        updated_work.images.push(uploaded_image);
      }

      // delete the uploaded images
      for (let i = 0; i < req.files.length; i++) {
        delete_uploaded_files(req.files[i], next);
      }
    }

    // check if the body hs a images_for_delete
    if (req.body.images_for_delete) {
      // split the images for delete to convert it to array
      const splited_images_for_delete =
        req.body.images_for_delete.split("split_here");

      // delete the images
      for (let i = 0; i < splited_images_for_delete.length; i++) {
        await delete_cloudinary(splited_images_for_delete[i], next);

        updated_work.images = work.images.filter((url) => {
          return url != splited_images_for_delete[i];
        });
      }
    }

    // save the updated work
    await updated_work.save();

    // create resposne
    const response = {
      message: {
        english: "updated successfully",
      },
      work_data: updated_work,
    };

    // send the resposne toclient
    res.status(200).send(response);
  } catch (error) {
    // delete the uploaded images
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
