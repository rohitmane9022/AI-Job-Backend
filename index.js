const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db/connect');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
// const recommendationRoutes = require('./routes/recommendations');

const app = express();


app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
// app.use('/api/job-recommendations', recommendationRoutes);

app.get("/", (req, res) => {
  res.send("hello check");
});

const PORT = 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server due to MongoDB connection error:', error);
    process.exit(1);
  });