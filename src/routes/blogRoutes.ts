import express from "express";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  getLastBlogPost
} from "../controllers/blogController";

const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.post("/", upload.single('image'), createBlogPost);
router.get("/", getAllBlogPosts);

router.get("/first", getLastBlogPost);

router.get("/:id", getBlogPostById);
router.put("/:id", updateBlogPost);
router.delete("/:id", deleteBlogPost);

export default router;
