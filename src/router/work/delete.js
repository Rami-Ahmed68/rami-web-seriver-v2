const express = require("express");
const router = express.Router();

// import the validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import the admin model
const Admin = require("../../model/admin/admin");

// import work model
const Work = require("../../model/work/work");

// import validate body data method
const validate_delete_work = require("../../controller/middleware/validation/work/delete");

// import delete cloudinary method
const delete_cloudinary_images = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import delete cloudinary method
const delete_cloudinary_video = require("../../controller/middleware/cloudinary/delete.cloudinary.video");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_delete_work(req.body);

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

    // find the admin by id
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admint not found",
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
          JONS.stringify({
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
          JOSN.stringify({
            english: "Sorry, invalid work nt found",
          }),
          404
        )
      );
    }

    // check if the work has any image
    if (work.images.length > 0) {
      for (let i = 0; i < work.images.length; i++) {
        // delete the work's images
        await delete_cloudinary_images(work.images[i], next);
      }
    }

    // check if the work has an cover
    if (work.cover != "") {
      // delete the cover
      await delete_cloudinary_images(work.cover, next);
    }

    // check if the work has a video
    if (work.video != "") {
      //  dleete the video
      await delete_cloudinary_video(work.video, next);
    }

    // delete the work
    await Work.deleteOne(work._id);

    // create response
    const response = {
      message: {
        english: "Deleted successfully",
      },
    };

    // send the response to client
    res.status(200).send(response);
  } catch (error) {
    // return erro
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
