const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const  {getRecommendations}  = require('../controllers/recommendationController');

router.get('/', authenticate, getRecommendations);

module.exports = router;
