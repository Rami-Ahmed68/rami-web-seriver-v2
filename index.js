const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const app = express();
app.use(express.json());
const cors = require("cors");
const Global = require("./src/controller/middleware/error/validate_error");
const ApiError = require("./src/controller/utils/error/validate_api");

// config the cors options
const cors_options = {
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
};

// use the cors config
app.use(cors(cors_options));

// import admin's endpoints files
const create_admin = require("./src/router/admin/create");
const update_admin = require("./src/router/admin/update");
const get_admin = require("./src/router/admin/get");
const get_admin_cv = require("./src/router/admin/get.cv");
const login_admin = require("./src/router/admin/login");
const change_avatar_admin = require("./src/router/admin/change.avatar");
const change_cv_admin = require("./src/router/admin/change.cv");
// import admin's endpoints files

// use admin's endpoints files
app.use("/api/v1/rami_ahmed/admin/create", create_admin);
app.use("/api/v1/rami_ahmed/admin/update", update_admin);
app.use("/api/v1/rami_ahmed/admin/get/cv", get_admin_cv);
app.use("/api/v1/rami_ahmed/admin/get", get_admin);
app.use("/api/v1/rami_ahmed/admin/login", login_admin);
app.use("/api/v1/rami_ahmed/admin/change/avatar", change_avatar_admin);
app.use("/api/v1/rami_ahmed/admin/change/cv", change_cv_admin);
// use admin's endpoints files

// import message's endpoints files
const create_message = require("./src/router/message/create");
const delete_message = require("./src/router/message/delete");
const get_all_message = require("./src/router/message/get.all");
const get_one_message = require("./src/router/message/get.one");
const get_count_message = require("./src/router/message/get.count");
// import message's endpoints files

// use message's endpoints files
app.use("/api/v1/rami_ahmed/message/create", create_message);
app.use("/api/v1/rami_ahmed/message/get/all", get_all_message);
app.use("/api/v1/rami_ahmed/message/get/one", get_one_message);
app.use("/api/v1/rami_ahmed/message/delete", delete_message);
app.use("/api/v1/rami_ahmed/message/get/count", get_count_message);
// use message's endpoints files

// import skill's endpoints files
const create_skill = require("./src/router/skill/create");
const update_skill = require("./src/router/skill/update");
const delete_skill = require("./src/router/skill/delete");
const get_one_skill = require("./src/router/skill/get.one");
const get_all_skill = require("./src/router/skill/get.all");
const get_count_skill = require("./src/router/skill/get.count");
const change_icon = require("./src/router/skill/change.icon");
// import skill's endpoints files

// use skill's endpoints files
app.use("/api/v1/rami_ahmed/skill/create", create_skill);
app.use("/api/v1/rami_ahmed/skill/update", update_skill);
app.use("/api/v1/rami_ahmed/skill/delete", delete_skill);
app.use("/api/v1/rami_ahmed/skill/get/one", get_one_skill);
app.use("/api/v1/rami_ahmed/skill/get/all", get_all_skill);
app.use("/api/v1/rami_ahmed/skill/get/count", get_count_skill);
app.use("/api/v1/rami_ahmed/skill/change/icon", change_icon);
// use skill's endpoints files

// import work's endpoints files
const create_work = require("./src/router/work/create");
const delete_work = require("./src/router/work/delete");
const update_work = require("./src/router/work/update");
const get_one_work = require("./src/router/work/get.one");
const get_all_work = require("./src/router/work/get.all");
const get_count_work = require("./src/router/work/get.count");
const change_cover_work = require("./src/router/work/change.cover");
const change_video_work = require("./src/router/work/change.video");
// import work's endpoints files

// use work's endpoints files
app.use("/api/v1/rami_ahmed/work/create", create_work);
app.use("/api/v1/rami_ahmed/work/delete", delete_work);
app.use("/api/v1/rami_ahmed/work/update", update_work);
app.use("/api/v1/rami_ahmed/work/get/all", get_all_work);
app.use("/api/v1/rami_ahmed/work/get/one", get_one_work);
app.use("/api/v1/rami_ahmed/work/get/count", get_count_work);
app.use("/api/v1/rami_ahmed/work/cover/change", change_cover_work);
app.use("/api/v1/rami_ahmed/work/video/change", change_video_work);
// use work's endpoints files
app.use(express.json());

// validate errors
app.all("*", (req, res, next) => {
  return next(
    new ApiError(
      JSON.stringify({
        english: "Invalid Api Not Found ...",
      }),
      404
    )
  );
});
// validate errors
// Global error handling middlware
app.use(Global);
// Global error handling middlware

//! connecting to data base
mongoose
  .connect(process.env.DATA_BASE_URI)
  .then(() => {
    console.log(`
      ##################################################
      ######------------###connected###-----------######
      ##################################################`);
  })
  .catch((error) => {
    console.log(error);
  });

//? starting the project on PORT
app.listen(process.env.PORT, () => {
  console.log(`App running on posrt : ${process.env.PORT}`);
});
