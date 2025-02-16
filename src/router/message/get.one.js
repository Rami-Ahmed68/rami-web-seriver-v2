const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import Message model
const Message = require("../../model/message/message");

router.get("/", async (req, res, next) => {
  try {
    // check if the request has a message id or not
    if (!req.query.message_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you should send a message's id",
          }),
          403
        )
      );
    }

    // getb to the message
    const message = await Message.findById(req.query.message_id);

    // create response
    const response = {
      message: message,
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
