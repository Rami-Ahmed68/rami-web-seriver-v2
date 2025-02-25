const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../config/.env" });
const path = require("path");

// api error method
const ApiError = require("../../utils/error/validate_api");

// create cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

const upload_cloudinary_image = async (file, next) => {
  try {
    // create the image path
    const Image_path = path.join(
      __dirname,
      `../../../../public/files/${file.filename}`
    );

    // upload the image to cloudinary
    const data = await cloudinary.uploader.upload(Image_path, {
      resource_type: "auto",
    });

    // return the data
    return data.secure_url;
  } catch (error) {
    return next(
      new ApiError(
        JSON.stringify({
          english: `${error} ...`,
          arabic: "... عذرا خطأ اثناء رفع الصورة",
        }),
        500
      )
    );
  }
};

module.exports = upload_cloudinary_image;
