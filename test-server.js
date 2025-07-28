const express = require('express');
const cors = require('cors');

// Simple test server without database
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running successfully!'
  });
});

// Test validation endpoint
app.post('/api/test-validation', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: [
        !name ? 'Name is required' : null,
        !email ? 'Email is required' : null
      ].filter(Boolean)
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: ['Please provide a valid email address']
    });
  }
  
  res.status(201).json({
    message: 'Validation passed!',
    data: { name, email }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
