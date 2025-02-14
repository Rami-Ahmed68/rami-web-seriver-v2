const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const app = express();
app.use(express.json());
const cors = require("cors");

// config the cors options
const cors_options = {
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
};

// use the cors config
app.use(cors(cors_options));

// import admin's endpoints files
const create_admin = require("./src/router/admin/create");
// import admin's endpoints files

// use admin's endpoints files
app.use("/api/v1/rami_ahmed/admin/create", create_admin);
// use admin's endpoints files

//! connecting to data base
mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log(`
      ##################################################
      ######            ###connected###           ######
      ##################################################`);
  })
  .catch((error) => {
    console.log(error);
  });

//? starting the project on PORT
app.listen(process.env.PORT, () => {
  console.log(`App running on posrt : ${process.env.PORT}`);
});
