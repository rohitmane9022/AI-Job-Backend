const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');
const { OpenAI } = require('openai');

const JWT_SECRET = process.env.JWT_SECRET;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allJobs = await Job.find();

    const jobList = allJobs.map(job =>
      `Title: ${job.title}, Skills: ${job.skills.join(', ')}, Location: ${job.location}`
    ).join('\n');

    const prompt = `Given the following user profile:
Skills: ${user.skills.join(', ')}
Experience: ${user.experience} years
Location: ${user.location}
Preferred Job Type: ${user.preferredJobType}

Recommend 3 jobs from the following list that best match the user's profile:
${jobList}

Return only the titles of the best matching jobs.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful job recommendation assistant.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo'
    });

    const recommendedTitles = completion.choices[0].message.content.split('\n').map(title => title.trim());

    const recommendedJobs = allJobs.filter(job =>
      recommendedTitles.some(title =>
        job.title.toLowerCase().includes(title.toLowerCase())
      )
    );

    res.json({ jobs: recommendedJobs });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating recommendations', error: err.message });
  }
};

module.exports = { getRecommendations };
