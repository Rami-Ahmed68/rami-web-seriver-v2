const express = require("express");
const router = express.Router();

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import skill model
const Skill = require("../../model/skill/skill");

router.get("/", async (req, res, next) => {
  try {
    // check if request has a skill id
    if (!req.query.skill_id) {
      // return error
      return next(
        new ApiError(
          JSON.stringify({
            english: "Sorry, you must send the skill's id",
          }),
          403
        )
      );
    }

    // get skill
    const skill = await Skill.findById(req.query.skill_id);

    // update the skill's views
    skill.views += 1;

    // save the skill after updated the
    await skill.save();

    // create response
    const response = {
      skill_data: skill,
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
