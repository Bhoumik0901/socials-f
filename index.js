const express = require("express");
const cors = require("cors");
const mongoose=require('mongoose')
const app = express();
const authRouter = require("./routes/auth");
const commentRouter = require("./routes/comments");
const postRouter = require("./routes/posts");
require('dotenv').config();

let mongoURL = process.env.MONGO_URL;
// const mongoURL = 'mongodb://127.0.0.1:27017/ebooks';
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURL);
    // await Book.collection.dropIndex("buyers_1")
    console.log("Connection made successfully");
  } catch (error) {
    console.error("Connection error:", error);
  }
};
connectToMongo();
// Use environment variable for PORT or default to 3000
const PORT = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
  'https://social-f-three.vercel.app',
  'http://localhost:5174',
  'http://localhost:5173',
  'https://zippy-trifle-f2f094.netlify.app'
  //  // Add your second origin here
];

// Define CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like mobile apps or curl)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and other credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};

// Apply CORS middleware
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '10mb' })); // Set a body size limit if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Route
app.use(authRouter);
app.use(commentRouter);
app.use(postRouter);

// Base route
app.get("/", (req, res) => {
  res.send("This is the new app created by Bhoumik.");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
