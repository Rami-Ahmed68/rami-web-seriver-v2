const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import work model
const Work = require("../../model/work/work");

router.get("/", async (req, res, next) => {
  try {
    // page
    const page = req.query.page || 1;

    // limit
    const limit = req.query.limit || 5;

    // skip
    const skip = (page - 1) * limit;

    // get works
    const works = await Work.find().skip(skip).limit(limit);

    // craete response
    const response = {
      works_data: works,
    };

    // send teh response
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
