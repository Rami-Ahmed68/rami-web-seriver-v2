const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import work model
const Work = require("../../model/work/work");

router.get("/", async (req, res, next) => {
  try {
    // check if the request has work_id
    if (!req.query.work_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you must send a work's id",
          }),
          403
        )
      );
    }

    // get work
    const work = await Work.findById(req.query.work_id);

    // update the work views
    work.views += 1;

    // save the work after updated the views
    await work.save();

    // craete response
    const response = {
      work_data: work,
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
