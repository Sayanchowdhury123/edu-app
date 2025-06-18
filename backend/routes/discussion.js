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
    });
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
  const { threadid } = req.params;
  try {
    const thread = await Discussion.findById(threadid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }
    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.post("/thread/:threadid/comment", protect, async (req, res) => {
  const { threadid } = req.params;
  const { text } = req.body;
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
    });

    await newdiscussion.save();
    res.status(200).json(newdiscussion);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:threadid", protect, async (req, res) => {
  const { threadid } = req.params;
  const { title, question } = req.body;
  try {
    if (!title || !question) {
      return res.status(400).json("data missing");
    }

    const thread = await Discussion.findById(threadid);
    if (!thread) {
      return res.status(440).json("thread not found");
    }

     if(req.user._id !== thread.user.toString() && req.user.role !== "instructor" ){
        return res.status(403).json("you are not allowed to edit thread")
      }

    thread.title = title;
    thread.question = question;

    await thread.save();

    res.status(200).json(thread);
  } catch (error) {
    console.log(error);
    res.status(500).json("server error");
  }
});

router.put("/thread/:threadid", protect, isinstructor, async (req, res) => {
  const { threadid } = req.params;
  try {
    const thread = await Discussion.findById(threadid);
    if (!thread) {
      return res.status(400).json("thread not found");
    }

    thread.isresolved = true;
    await thread.save();

    res.status(200).json("thread is resloved");
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
    try {
    
        

      if (!text) {
        return res.status(400).json("text is missing");
      }

      const thread = await Discussion.findById(threadid);
      if (!thread) {
        return res.status(400).json("thread not found");
      }

      const newcomment = thread.comment.find(
        (c) => c._id.toString() === commentid
      );
      if (!newcomment) {
        return res.status(400).json("comment not found");
      }

      if(req.user._id !== newcomment.user.toString() && req.user.role !== "instructor" ){
        return res.status(403).json("you are not allowed to edit comments")
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
    const thread = await Discussion.findByIdAndDelete(threadid);
    res.status(200).json("thread deleted");
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

      thread.comment = thread.comment.filter(
        (c) => c._id.toString() !== commentid
      );
      await thread.save();

      res.status(204).json("comment deleted");
    } catch (error) {
      console.log(error);
      res.status(500).json("server error");
    }
  }
);
