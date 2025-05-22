const express = require('express');
const cors = require('cors');

require('dotenv').config();
const connectDB = require('./db/connect');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
// const recommendationRoutes = require('./routes/recommendations');

const app = express();
connectDB()


const corsOptions = {
  origin: 'https://ai-job-frontends.vercel.app',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

//Routes Check
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
// app.use('/api/job-recommendations', recommendationRoutes);

app.get("/",(req,res)=>{
    res.send("hello check")
})



  app.listen(5000, () => {
    console.log('🚀 Server running on http://localhost:5000');
  });

