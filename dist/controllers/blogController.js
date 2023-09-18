"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostById = exports.getLastBlogPost = exports.getAllBlogPosts = exports.createBlogPost = void 0;
const BlogPost_1 = __importDefault(require("../models/BlogPost"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { S3Client, GetObjectCommand, } = require('@aws-sdk/client-s3');
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAcessKey = process.env.SECRET_ACCESS_KEY;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAcessKey
    },
    region: bucketRegion
});
const createBlogPost = async (req, res) => {
    try {
        const { title, content, author, category, awsUrl } = req.body;
        const newBlogPost = new BlogPost_1.default({
            title,
            content,
            author,
            category,
            awsUrl
        });
        await newBlogPost.save();
        res.status(201).json(newBlogPost);
    }
    catch (error) {
        res.status(500).json({ error: "Could not create blog post" });
    }
};
exports.createBlogPost = createBlogPost;
const getAllBlogPosts = async (_req, res) => {
    try {
        const blogPosts = await BlogPost_1.default.find().sort({ date: -1 });
        for (const post of blogPosts) {
            const getObjectParams = {
                Bucket: bucketName,
                Key: post.awsUrl
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
            post.imgUrl = url;
        }
        res.status(200).json(blogPosts);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Could not fetch blog posts" });
    }
};
exports.getAllBlogPosts = getAllBlogPosts;
const getLastBlogPost = async (_req, res) => {
    try {
        const lastBlogPost = await BlogPost_1.default.findOne().sort({ date: -1 });
        const getObjectParams = {
            Bucket: bucketName,
            Key: lastBlogPost.awsUrl
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
        lastBlogPost.imgUrl = url;
        if (lastBlogPost) {
            res.status(200).json({ lastBlogPost, url });
        }
        else {
            res.status(404).json({ message: "No blog posts found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch the last blog post" });
    }
};
exports.getLastBlogPost = getLastBlogPost;
const getBlogPostById = async (req, res) => {
    try {
        const blogPost = await BlogPost_1.default.findById(req.params.id);
        const getObjectParams = {
            Bucket: bucketName,
            Key: blogPost.awsUrl
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
        blogPost.imgUrl = url;
        if (!blogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json({ blogPost, url });
    }
    catch (error) {
        res.status(500).json({ error: "Could not fetch blog post" });
    }
};
exports.getBlogPostById = getBlogPostById;
const updateBlogPost = async (req, res) => {
    try {
        const updatedBlogPost = await BlogPost_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(200).json(updatedBlogPost);
    }
    catch (error) {
        res.status(500).json({ error: "Could not update blog post" });
    }
};
exports.updateBlogPost = updateBlogPost;
const deleteBlogPost = async (req, res) => {
    try {
        const deletedBlogPost = await BlogPost_1.default.findByIdAndDelete(req.params.id);
        if (!deletedBlogPost) {
            return res.status(404).json({ error: "Blog post not found" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Could not delete blog post" });
    }
};
exports.deleteBlogPost = deleteBlogPost;
//# sourceMappingURL=blogController.js.map