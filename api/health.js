module.exports = (req, res) => {
  res.json({ status: 'ok', message: 'Lunetix API is running', timestamp: new Date().toISOString() });
};
