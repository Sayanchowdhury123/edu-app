const express = require("express");
const { protect } = require("../middleware/auth");
const Course = require("../models/course");
const User = require("../models/user");
const router = express.Router();
const {uploadavatar} = require("../middleware/upload")


router.get("/profile", protect, async (req,res) => {
    try {
        const userid = req.user._id;
        const user = await User.findById(userid).select("-password").populate("wishlist", "title thumbnail").lean();
        const enrolledcourses = await Course.find({enrolledusers: req.user._id});

        res.status(200).json({
            user,
            enrolledcourses
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "failed to fetch user profile"})
    }
})

router.put("/profile", protect, async (req,res) => {
    try {
        const {name} = req.body;

             const userid = req.user._id;
        const user = await User.findById(userid);
        if(!user){
            return res.status(400).json({msg:'user not found'})
        }
        user.name = name;
        await user.save()
        
       res.status(200).json({
            user,
            msg:"profile updated"
        })
    } catch (error) {
           console.log(error);
        res.status(500).json({msg: "failed to edit user profile"})
    }
})


router.get("/wishlist",protect,async (req,res) => {
    try {
           const userid = req.user._id;
    const user = await User.findById(userid).populate("wishlist","title category thumbnail")
    res.status(200).json({
        wishlist: user.wishlist
    })
    } catch (error) {
        console.log(error);
       res.status(500).json({msg:"failed to fetch wishlist"})
    }
})

router.patch("/upload-avatar",protect,uploadavatar.single("avatar"),async (req,res) => {
    try {
        const {path} = req.file;
         const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
     
    user.avatar = path;
    await user.save();
    res.status(200).json({msg:"avatar uploaded",avatar: req.file.path})
    
    } catch (error) {
        console.log(error);
    res.status(500).json({msg:"failed to upload avatar" })
    }
})


router.post("/wishlist/:courseid", protect, async (req, res) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
 
    user.wishlist.push(req.params.courseid)
    await user.save();
    res.status(200).json({msg:"Added to wishlist"})
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:"failed to add to wishlist"})
  }
});

router.delete("/wishlist/:courseid", protect, async (req,res) => {
    try {
        const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

  user.wishlist =  user.wishlist.filter((c) => c._id.toString() !== req.params.courseid.toString())

    await user.save();
        res.status(200).json({msg:"deleted from wishlist"})
    } catch (error) {
        console.log(error);
    res.status(500).json({msg:"failed to add to wishlist"})
    }
})


module.exports = router;