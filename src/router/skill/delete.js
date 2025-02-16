const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin model
const Admin = require("../../model/admin/admin");

// import skill model
const Skill = require("../../model/skill/skill");

// import validate body data method
const validate_delete_skill = require("../../controller/middleware/validation/skill/delete");

// import delete cloudinar method
const delete_cloudinary = require("../../controller/middleware/cloudinary/delete.cloudinary.image");

// import verify token method
const verify_token = require("../../controller/utils/token/verify");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_delete_skill(req.body);

    // check if the body has any error
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

    // find the admin by idf
    const admin = await Admin.findById(req.body.admin_id);

    // check if the admin is exists
    if (!admin) {
      // return  error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin not found",
          }),
          404
        )
      );
    }

    // find the skill
    const skill = await Skill.findById(req.body.skill_id);

    // check if the skill is exists
    if (!skill) {
      // returbn error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid skill not found",
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

    // delete the skill's icon
    await delete_cloudinary(skill.icon, next);

    // delete the skill
    await Skill.deleteOne(skill._id);

    // create response
    const response = {
      message: {
        english: "Deleted successfully",
      },
    };

    //send the response to client
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
