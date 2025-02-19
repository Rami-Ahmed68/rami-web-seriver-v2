const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import messgae model
const Message = require("../../model/message/message");

router.get("/", async (req, res, next) => {
  try {
    // get counts
    const messages_count = await Message.countDocuments({});

    // create response
    const response = {
      messages_count: messages_count,
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
