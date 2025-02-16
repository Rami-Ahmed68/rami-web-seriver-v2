const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import skill model
const Skill = require("../../model/skill/skill");

router.get("/", async (req, res, next) => {
  try {
    // page
    const page = req.query.page || 1;

    // limit
    const limit = req.query.limit || 5;

    // skip
    const skip = (page - 1) * limit;

    // get skills
    const skills = await Skill.find().skip(skip).limit(limit);

    // create response
    const response = {
      skills_data: skills,
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
