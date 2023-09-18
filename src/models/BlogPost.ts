import mongoose, { Document, Schema } from "mongoose";

enum BlogPostCategory {
    PROGRAMMING = "programming",
    CYBERSECURITY = "cyber-security",
    BLOCKCHAIN = "blockchain",
    MACHINELEARNING = "machine-learning",
    NETWORKS = "networks",
    CLOUDCOMPUTING = "cloud-computing",
    BIOLOGY = "biology",
    CHEMESTRY = "chemestry",
    MATH = "math",
    PHYSICS = "physics",
    LIFESCIENCE = "life-science",
    THEOLOGY = "theology"
  }

interface IBlogPost extends Document {
  ownerid: string
  title: string;
  content: string;
  author: string;
  date: Date;
  imgUrl: string;
  awsUrl: string;
  category: BlogPostCategory;
}

const BlogPostSchema = new Schema({
    ownerid: { type: String, default: '' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, default: Date.now },
    imgUrl: { type: String, default: '' },
    awsUrl: { type: String, default: '' },
    category: {
    type: String,
    enum: Object.values(BlogPostCategory), // Only allows values from the enum
    required: true,
  },
});

export default mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
