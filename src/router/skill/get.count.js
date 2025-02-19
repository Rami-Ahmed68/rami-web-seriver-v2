const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import skill model
const Skill = require("../../model/skill/skill");

router.get("/", async (req, res, next) => {
  try {
    // get counts
    const skills_count = await Skill.countDocuments({});

    // create response
    const response = {
      skills_count: skills_count,
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
