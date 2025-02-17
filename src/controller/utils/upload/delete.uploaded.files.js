const fs = require("fs");
const ApiError = require("../error/validate_api");

const delete_uploaded_files = (image, next) => {
  // delete the image
  if (!image) {
    // return error
    return next(
      new ApiError(
        JSON.stringify({
          english: "Sorry, no any file to delete ...",
          arabic: "... عذرا لا يوجد اي ملف للحذف",
        }),
        403
      )
    );
  }
  fs.unlink(image.path, (error) => {
    if (error) {
      return next(new ApiError(error, 500));
    }
  });
};

module.exports = delete_uploaded_files;
