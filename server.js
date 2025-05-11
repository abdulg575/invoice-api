const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Endpoint: POST /upload
app.post('/upload', upload.single('invoice'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed.' });
  }

  return res.status(200).json({
    message: 'File uploaded successfully!',
    filename: req.file.filename,
    path: req.file.path
  });
});

// Final port declaration (only once!)
const port = process.env.PORT || 3000;

// Proper listen setup for Render
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}/`);
});
