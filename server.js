// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// —– Multer storage setup —–
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${suffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// —– Upload endpoint —–
app.post('/upload', upload.single('invoice'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed.' });
  }
  res.json({
    message: 'File uploaded successfully!',
    filename: req.file.filename,
    path: req.file.path,
  });
});

// —– PORT binding & listen —–
const port = process.env.port || 3000;
app.listen(port, '0.0.0.0', () => {
  // this must print the actual number, not the word "PORT"
  console.log(`🚀 Listening on port ${port}`);
});
