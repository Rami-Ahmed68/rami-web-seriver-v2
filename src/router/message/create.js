const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import message's model
const Message = require("../../model/message/message");

// import validate body data method
const validate_create_message = require("../../controller/middleware/validation/message/create");

router.post("/", async (req, res, next) => {
  try {
    // validate body data
    const Error = validate_create_message(req.body);

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

    // create message
    const message = new Message({
      full_name: req.body.full_name,
      email_address: req.body.email_address,
      phone_number: req.body.phone_number,
      whatsapp_number: req.body.whatsapp_number,
      custom_message: req.body.custom_message,
      created_at: req.body.created_at,
    });

    // save the message
    await message.save();

    // create response
    const response = {
      message: {
        english: "Messages created successfully",
      },
    };

    // send the response to client
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
