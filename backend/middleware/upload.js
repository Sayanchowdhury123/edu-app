const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")


const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "udemy_clone/videos",
        resource_type: "video",
        allowed_formats: ["mp4","mov", "mkv"]
    }
})


const upload = multer({storage})

module.exports = upload;