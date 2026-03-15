import multer from "multer";
import fs from "fs";
import path from "path";

// Allowed file types and max file size (2MB)
const allowedMimeTypes = ["audio/wav", "audio/mpeg"]; // "audio/mpeg" covers MP3 files
const allowedMimeTypesImage = ["image/png", "image/svg+xml", "image/jpeg"];

const maxSize = 1024 * 1024 * 5; // 5MB

// Helper function to create a folder if it doesn't exist
const ensureDirectoryExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
};

// Define upload folders based on field names
const uploadDirs = {
  profileImages: "uploads/images/profile/",
  audio: "uploads/products/",
  notificationImages: "uploads/images/notification/",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";
    if (req.url.includes("/profile")) {
      uploadPath = "uploads/images/profiles/";
    } else if (req.url.includes("/audio")) {
      uploadPath = "uploads/audio/";
    }
    const dir = uploadDirs[file.fieldname] || "uploads/others/";

    // Ensure the folder exists
    ensureDirectoryExists(uploadPath);

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // my
    let fileName = file.originalname;
    // if (req.url.includes("/profile")) {
    //   fileName = `${file.originalname.split(".")[0]}.svg`;
    // } else if (req.url.includes("/audio")) {
    //   fileName = `${file.originalname.split(".")[0]}.wav`;
    // }
    console.log("-------fileName", fileName);

    const dirName =
      Object.keys(uploadDirs).find((key) => key === file.fieldname) || "others";
    const uniqueName = `${Date.now()}_${dirName}${path
      .extname(file.originalname)
      .toLowerCase()}`;
    cb(null, uniqueName);
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  // my 
    // Check file type
     if (req.url.includes("/profile")) {
      if (!allowedMimeTypesImage.includes(file.mimetype)) {
        return cb(isImage ? null : "Error: Invalid file type. Only PNG, SVG, and JPEG are allowed.", false);
      }
     } else if (req.url.includes("/audio")) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(isImage ? null : "Error: Invalid file type. Only WAV and MP3 are allowed.", false);
      }
    }
  // const validFileTypes = /jpeg|jpg|png|gif/;
  // const isImage =validFileTypes.test(path.extname(file.originalname).toLowerCase()) &&validFileTypes.test(file.mimetype);
};

// Configure Multer
const upload = multer({
  storage,
  limits: { fileSize:maxSize  }, // Limit file size to 5MB
  fileFilter,
});

export { upload };
