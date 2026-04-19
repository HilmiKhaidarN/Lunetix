const coursesController = require('../../backend/src/controllers/coursesController');
const { handleCorsPreFlight } = require('../middleware/cors');

module.exports = async (req, res) => {
  if (handleCorsPreFlight(req, res)) return;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    await coursesController.getAllCourses(req, res);
  } catch (err) {
    console.error('[API] Courses error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
