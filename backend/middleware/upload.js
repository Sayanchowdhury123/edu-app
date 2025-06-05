const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")


const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

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

const avatarstorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "udemy_clone/avatars",
        resource_type: "image",
        allowed_formats: ["jpg","jpeg", "png","webp"]
    }
})


const uploadvideo = multer({storage: videostorage})
const uploadimage = multer({storage: imagestorage})
const uploadavatar = multer({storage: avatarstorage})

module.exports = {uploadimage,uploadvideo,uploadavatar};