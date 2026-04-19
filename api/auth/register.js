const authController = require('../../backend/src/controllers/authController');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    await authController.register(req, res);
  } catch (err) {
    console.error('[API] Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
