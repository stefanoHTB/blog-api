require('dotenv').config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import blogRoutes from "./routes/blogRoutes";
const connectDB = require('./config/dbConn');

import { generateUploadURL } from './s3'


const port = process.env.PORT || 3000;

connectDB();

const app = express();

//TESTING
var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
  };

//PRODUCTION
  // var corsOptions = {
  //   origin: ["https://susshitechnologies.com","https://bahiascience.com"],
  //   credentials: true
  // };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());


app.get('/api/s3Url', async (req, res) => {
  try {
    const url = await generateUploadURL()
    res.send({ url });

  } catch (err) {
    console.log(err)
  }

})

app.use("/api/blog", blogRoutes);


mongoose.connection.once('open', () => {
console.log('Connected to MongoDB');
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
