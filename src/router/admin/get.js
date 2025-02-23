const express = require("express");
const router = express.Router();
const _ = require("lodash");

// import validate api error method
const ApiError = require("../../controller/utils/error/validate_api");

// import admin's model
const Admin = require("../../model/admin/admin");

router.get("/", async (req, res, next) => {
  try {
    // find the admin
    const admin = await Admin.findOne();

    // check if the admin is exists
    if (!admin) {
      // return error
      return enxt(
        new ApiError(
          JSON.stringify({
            english: "Sorry, invalid admin not found",
          }),
          404
        )
      );
    }

    // update the views
    admin.views += 1;

    // save the admin after updated
    await admin.save();

    // create response
    const response = {
      admin_data: _.pick(admin, [
        "name",
        "avatar",
        "work",
        "bio",
        "love",
        "linked_in",
        "instagram",
        "facebook",
        "phone_number",
        "whatsapp_number",
        "github",
        "code_wars",
      ]),
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
