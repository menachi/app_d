const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts_controller");

router.get("/", postsController.getAllPosts);

router.post("/", postsController.createPost);

router.delete("/", postsController.deletePost);

module.exports = router;
