const express = require("express");
const router = express.Router();

// import the validate api method
const ApiError = require("../../controller/utils/error/validate_api");

// import the admin model
const Admin = require("../../model/admin/admin");

// import the skill model
const Skill = require("../../model/skill/skill");

// import the validate body data method
const validate_update_skill = require("../../controller/middleware/validation/skill/update");

// import verify token data method
const verify_token = require("../../controller/utils/token/verify");

router.put("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_update_skill(req.body);

    // check if the body data has any error
    if (Error.error) {
      // return the error
      return next(
        new ApiError(
          JSON.stringify({
            english: Error.error.details[0].message,
          }),
          400
        )
      );
    }

    // check if the body has any data for update
    if (!req.body.title && !req.body.description && !req.body.created_at) {
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

    // find the admin by id
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

    // find the skill
    const skill = await Skill.findById(req.body.skill_id);

    // check if the skill is exists
    if (!skill) {
      // return the error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid skill not found",
          }),
          404
        )
      );
    }

    // update the skill
    const updated_skill = await Skill.findByIdAndUpdate(
      { _id: req.body.skill_id },
      {
        $set: {
          title: req.body.title ? req.body.title : skill.title,
          description: req.body.description
            ? req.body.description
            : skill.description,
          created_at: req.body.created_at
            ? req.body.created_at
            : skill.created_at,
        },
      },
      {
        new: true,
      }
    );

    // save the updated skill
    await updated_skill.save();

    // create response
    const response = {
      message: {
        english: "Updated successfully",
      },
      skill_data: updated_skill,
    };

    // send the response to client
    res.status(200).send(response);
  } catch (error) {
    // return return
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
