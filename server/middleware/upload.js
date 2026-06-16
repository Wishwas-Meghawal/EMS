// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/profiles";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `profile-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only JPG, JPEG, PNG files are allowed"));
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

// ✅ Wrapper jo MulterError ko properly handle kare
export const uploadSingle = (fieldName) => (req, res, next) => {
  console.log("🚀 uploadSingle called for field:", fieldName); // debug

  upload.single(fieldName)(req, res, (err) => {
    console.log("📦 multer done, err:", err); // debug
    
    if (err instanceof multer.MulterError) {
      console.log("❌ MulterError field:", err.field);
      return res.status(400).json({ 
        error: `Upload error: ${err.message}`,
        field: err.field  // ← YE FIELD NAME BATAO MUJHE
      });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

export default upload;