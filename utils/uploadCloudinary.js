import { v2 as cloudinary } from "cloudinary";

export async function uploadStream(buffer) {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: "cvs",
      };

      const theTransformStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              resumeUrl: result.secure_url,
              resumeId: result.public_id,
            });
          }
        }
      );
      theTransformStream.end(buffer);
    });
  } catch (error) {
    return;
  }
}
