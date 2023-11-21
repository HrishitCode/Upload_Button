import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/fileUpload', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  content: Buffer,  
  uploadDate: { type: Date, default: Date.now }
});


const File = mongoose.model('File', fileSchema);


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const filePromises = req.files.map((file) => {
      const content = fs.readFileSync(file.path);
      const newFile = new File({
        filename: file.originalname,
        path: file.path,
        size: file.size,
        content: content
      });
      return newFile.save();
    });

    await Promise.all(filePromises);
    res.status(201).send('Files uploaded successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
