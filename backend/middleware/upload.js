const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")


const cloudinary = require("../config/cloudinary");

const videostorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "udemy_clone/videos",
        resource_type: "video",
        allowed_formats: ["mp4","mov", "mkv"]
    }
})

const imagestorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "udemy_clone/thumbnails",
        resource_type: "image",
        allowed_formats: ["jpg","jpeg", "png","webp"]
    }
})


const uploadvideo = multer({storage: videostorage})
const uploadimage = multer({storage: imagestorage})

module.exports = {uploadimage,uploadvideo};