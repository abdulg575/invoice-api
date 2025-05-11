// server.js
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app = express();

// ─── Multer Storage Setup ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ─── File‐Upload Endpoint ───────────────────────────────────────────────────────
app.post('/upload', upload.single('invoice'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File upload failed.' });
  }
  res.status(200).json({
    message: 'File uploaded successfully!',
    filename: req.file.filename,
    path:     req.file.path
  });
});

// ─── Port Binding for Render ────────────────────────────────────────────────────
// final (and only) port declaration:
const port = process.env.PORT || 3000;
// bind to 0.0.0.0 so Render can detect it:
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}/`);
});
