const Job = require("../models/Job");


exports.createJob = async (req, res) => {
  try {
    const { title, company, location, skills, type, description } = req.body;

    if (!title || !company || !location || !skills || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = new Job({
      title,
      company,
      location,
      skills,
      type,
      description
    });

    await newJob.save();

    res.status(201).json({
      message: "Job created successfully",
      job: newJob
    });
  } catch (error) {
    console.error(" Error creating job:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getJobs = async (req, res) => {
    try {
      const jobs = await Job.find(); 
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
  };
