const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin's model
const Admin = require("../../model/admin/admin");

// import messgae's model
const Message = require("../../model/message/message");

// import verify token data method
const verify_token = require("../../controller/utils/token/verify");

// import validate body data
const validate_delete_message = require("../../controller/middleware/validation/message/create");

router.delete("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_delete_message(req.body);

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
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin data",
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
            english: "sorry, invalid admin data",
          }),
          404
        )
      );
    }

    // find the message
    const message = await Message.findById(req.body.message_id);

    // check if the admin is exists
    if (!message) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "sorry, invalid message not found",
          }),
          404
        )
      );
    }

    // delete the message
    await Message.deleteOne(message._id);

    // create response
    const response = {
      message: {
        english: "Message deleted successfully",
      },
    };

    // send the response
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
