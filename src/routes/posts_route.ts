import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";



router.get("/", postsController.getAll.bind(postsController));

router.get("/:id", (req, res) => {
    postsController.getById(req, res);
});

router.post("/", postsController.create.bind(postsController));

router.delete("/:id", postsController.deleteItem.bind(postsController));

export default router;