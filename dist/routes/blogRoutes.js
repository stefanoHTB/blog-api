"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const router = express_1.default.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/", upload.single('image'), blogController_1.createBlogPost);
router.get("/", blogController_1.getAllBlogPosts);
router.get("/first", blogController_1.getLastBlogPost);
router.get("/:id", blogController_1.getBlogPostById);
router.put("/:id", blogController_1.updateBlogPost);
router.delete("/:id", blogController_1.deleteBlogPost);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map