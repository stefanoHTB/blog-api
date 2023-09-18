import { Request, Response } from "express";
import BlogPost from "../models/BlogPost";
import dotenv from 'dotenv'

dotenv.config();

// aws configuration
const { S3Client, GetObjectCommand, } = require('@aws-sdk/client-s3');

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAcessKey = process.env.SECRET_ACCESS_KEY

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAcessKey
    },
    region: bucketRegion
})


// Create a new blog post
export const createBlogPost = async (req: Request, res: Response) => {

    // if(!req.body?.title || !req.body?.content || !req.body?.author || !req.body?.category || !req.body?.awsUrl ) {
    //     return res.status(400).json({'meesage': 'fields required'})
    // }
    try {
        const { title, content, author, category, awsUrl } = req.body;
        
        const newBlogPost = new BlogPost({
           title,
           content,
           author, 
           category,
           awsUrl
         });

        await newBlogPost.save();
        res.status(201).json(newBlogPost);
      } catch (error) {
        res.status(500).json({ error: "Could not create blog post" });
      }
};

// Get all blog posts
export const getAllBlogPosts = async (_req: Request, res: Response) => {
    try {
        const blogPosts = await BlogPost.find().sort({ date: -1 });

        for (const post of blogPosts) {

          const getObjectParams = {
              Bucket: bucketName,
              Key: post.awsUrl
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
        post.imgUrl = url
        }

        res.status(200).json(blogPosts);
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message ||"Could not fetch blog posts" });
      }
};

// Get only last posts from the blog list
export const getLastBlogPost = async (_req: Request, res: Response) => {
  try {
    const lastBlogPost = await BlogPost.findOne().sort({ date: -1 });

    const getObjectParams = {
      Bucket: bucketName,
      Key: lastBlogPost.awsUrl
     }

     const command = new GetObjectCommand(getObjectParams);
     const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
     lastBlogPost.imgUrl = url

    if (lastBlogPost) {
      res.status(200).json({lastBlogPost, url});
    } else {
      res.status(404).json({ message: "No blog posts found" });
    }

  } catch (error) {
    res.status(500).json({ error: "Could not fetch the last blog post" });
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (req: Request, res: Response) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    const getObjectParams = {
      Bucket: bucketName,
      Key: blogPost.awsUrl
     }

     const command = new GetObjectCommand(getObjectParams);
     const url = await getSignedUrl(s3, command, { expiresIn: 360000 });
     blogPost.imgUrl = url

    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(200).json({blogPost, url});

  } catch (error) {
    res.status(500).json({ error: "Could not fetch blog post" });
  }

};

// Update a blog post by ID
export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBlogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ error: "Could not update blog post" });
  }

};

// Delete a blog post by ID
export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Could not delete blog post" });
  }

};



