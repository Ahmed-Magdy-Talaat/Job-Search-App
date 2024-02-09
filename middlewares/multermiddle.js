import multer from "multer";

export const multerMiddle = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, this.file.originalname);
    },
  });
  const upload = multer({ storage });
  return upload;
};
