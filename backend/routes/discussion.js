const express = require("express");
const { protect, isinstructor } = require("../middleware/auth");
const router = express.Router();
const Course = require("../models/course");
const Discussion = require("../models/discussionforum");

router.get("/:courseid", protect, async (req, res) => {
  const { courseid } = req.params;

  try {
    const threads = await Discussion.find({
      course: courseid,
    }).populate("user")

    if (threads.length === 0) {
      return res.status(400).json("threads not found");
    }
    res.status(200).json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.get("/thread/:theadid", protect, async (req, res) => {
  
  try {
    const thread = await Discussion.findById(req.params.theadid).populate("user comment.user")
    if (!thread) {
      return res.status(400).json("thread not found");
    }
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:threadid/comment", protect, async (req, res) => {
  const { threadid } = req.params;
  const { text } = req.body;
  console.log(threadid,text);
  try {
    if (!text) {
      return res.status(400).json("text is missing");
    }
    const thread = await Discussion.findById(threadid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.comment.push({
      text,
      user: req.user._id,
    });

    await thread.save();

  await thread.populate("comment.user");

   const newcomment = thread.comment[thread.comment.length - 1];
    
    
    res.status(201).json(newcomment);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.post("/:courseid/create", protect, async (req, res) => {
  const { courseid } = req.params;
  const { title, question } = req.body;
  try {
    if (!title || !question) {
      return res.status(400).json("data missing");
    }

    const newdiscussion = new Discussion({
      course: courseid,
      user: req.user._id,
      title: title,
      question: question,
      comment: [],
    })

       await newdiscussion.save()

    await newdiscussion.populate("user")

    res.status(200).json(newdiscussion);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:tid", protect, async (req, res) => {
  const { tid } = req.params;
  const { title, question } = req.body;
  console.log(req.params.tid);
  try {
    if (!title || !question) {
      return res.status(400).json("data missing");
    }

    const thread = await Discussion.findById(req.params.tid);
    if (!thread) {
      return res.status(404).json("thread not found");
    }

    

    thread.title = title;
    thread.question = question;

    await thread.save();

    await thread.populate("user")

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:tid/resolve", protect, isinstructor, async (req, res) => {
  const { tid } = req.params;
  
  try {
    const thread = await Discussion.findById(tid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.isresolved = true;
    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:tid/unresolve", protect, isinstructor, async (req, res) => {
  const { tid } = req.params;
  
  try {
    const thread = await Discussion.findById(tid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.isresolved = false;
    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put(
  "/thread/:threadid/comment/:commentid",
  protect,
  async (req, res) => {
    const { threadid } = req.params;
    const { commentid } = req.params;
    const { text } = req.body;
    console.log(commentid,text);
    try {
    
        

      if (!text) {
        return res.status(400).json("text is missing");
      }

      const thread = await Discussion.findById(threadid);
      if (!thread) {
        return res.status(400).json("thread not found");
      }

      const newcomment = thread.comment.find((c) => c._id.toString() === commentid);
      if (!newcomment) {
        return res.status(400).json("comment not found");
      }

     
      newcomment.text = text;
      await thread.save();

      res.status(200).json(thread);
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  }
);

router.delete("/thread/:threadid", protect, async (req, res) => {
  const { threadid } = req.params;
  try {
    const thread = await Discussion.findById(threadid);
      if (!thread) {
        return res.status(404).json("thread not found");
      }

   


      await Discussion.findByIdAndDelete(threadid)

    res.status(202).json("thread deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.delete(
  "/thread/:threadid/comment/:commentid",
  protect,
  async (req, res) => {
    const { threadid } = req.params;
    const { commentid } = req.params;
    
    try {
      const thread = await Discussion.findById(threadid);
      if (!thread) {
        return res.status(400).json("thread not found");
      }

      const comment = thread.comment.find(c => c._id.toString() === commentid)
      
     

      thread.comment = thread.comment.filter(
        (c) => c._id.toString() !== commentid
      );
      await thread.save();

      res.status(202).json("comment deleted");
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  }
);


router.put("/thread/:tid/inlike", protect, async (req, res) => {
  const { tid } = req.params;
  
  
  try {
    const thread = await Discussion.findById(tid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.likes.push(req.user._id)
    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:tid/delike", protect, async (req, res) => {
  const { tid } = req.params;
  
  
  try {
    const thread = await Discussion.findById(tid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.likes = thread.likes.filter((t) => t !== req.user._id.toString())
    await thread.save();
    console.log(thread.likes);
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:tid/adddis", protect, async (req, res) => {
  const { tid } = req.params;
  
  
  try {
    const thread = await Discussion.findById(tid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.dislikes.push(req.user._id)
    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:tid/removedis", protect, async (req, res) => {
  const { tid } = req.params;
  
  
  try {
    const thread = await Discussion.findById(tid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

     thread.dislikes = thread.dislikes.filter((t) => t !== req.user._id.toString())
    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});







module.exports = router;
