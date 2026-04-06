const { cloudinary, configureCloudinary } = require("../config/cloudinary");

const MAX_DIMENSION = 1600;
const COVER_WIDTH = 1200;
const COVER_HEIGHT = 1500;

function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    stream.end(buffer);
  });
}

async function uploadImageBuffer(buffer, preset, cropFocus) {
  configureCloudinary();

  const transformation =
    preset === "cover"
      ? [
          {
            width: COVER_WIDTH,
            height: COVER_HEIGHT,
            crop: "fill",
            gravity: cropFocus,
          },
          { quality: "auto:good", fetch_format: "auto" },
        ]
      : [
          {
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            crop: "limit",
          },
          { quality: "auto:good", fetch_format: "auto" },
        ];

  const result = await uploadToCloudinary(buffer, {
    folder: "fashion-asia/products",
    resource_type: "image",
    transformation,
  });

  return result.secure_url;
}

module.exports = {
  uploadImageBuffer,
};
