import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";



router.get("/", postsController.getAllPosts);

router.get("/:id", (req, res) => {
    postsController.getPostById(req, res);
});

router.post("/", postsController.createPost);

router.delete("/:id", postsController.deletePost);

export default router;