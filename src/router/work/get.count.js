const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import work model
const Work = require("../../model/work/work");

router.get("/", async (req, res, next) => {
  try {
    // get counts
    const works_count = await Work.countDocuments({});

    // create response
    const response = {
      works_count: works_count,
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
