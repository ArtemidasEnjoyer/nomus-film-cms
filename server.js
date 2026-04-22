import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseSync } from 'node:sqlite';
import { z } from 'zod';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DIST_DIR = path.join(__dirname, 'dist');
const DB_FILE = path.join(DATA_DIR, 'database.sqlite');
const DEFAULT_PASSWORD = crypto.randomBytes(8).toString('hex');
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] No JWT_SECRET found in env. Sessions will be invalidated on server restart.');
}

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(bodyParser.json());

// Set basic security headers including a working CSP
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: /uploads/ /assets/;"
  );
  next();
});

// Serve static files from Vite build
app.use(express.static(DIST_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Initialize everything synchronously
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(UPLOADS_DIR);

const db = new DatabaseSync(DB_FILE);

// Setup Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS auth (
    id INTEGER PRIMARY KEY,
    setup INTEGER,
    username TEXT,
    password TEXT
  );
`);

// Initialize Auth
const getAuthData = () => {
  let authData = db.prepare('SELECT * FROM auth WHERE id = 1').get();
  if (!authData) {
    db.prepare('INSERT INTO auth (id, setup, username, password) VALUES (1, 0, ?, ?)').run('', DEFAULT_PASSWORD);
    authData = db.prepare('SELECT * FROM auth WHERE id = 1').get();
  }
  
  if (authData.setup === 0) {
    console.log('\n=============================================');
    console.log('[SECURITY] System needs setup.');
    console.log(`[SECURITY] Temporary Admin Password: ${authData.password}`);
    console.log('=============================================\n');
  }
  
  return { ...authData, setup: authData.setup === 1 };
};
getAuthData();

// Middleware: Validation
const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: 'Validation Error', details: error.errors });
  }
};

// Zod Schemas
const authSchema = z.object({
  username: z.string().optional().default(''),
  password: z.string().min(1, 'Password is required')
});

const setupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  type: z.enum(['news', 'portfolio']).default('news')
});

// Middleware: Authenticate
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  const authData = getAuthData();

  if (!authData.setup) {
    if (token === authData.password) return next();
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

// --- API ROUTES ---

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/auth/status', (req, res) => {
  const authData = getAuthData();
  res.json({ setup: authData.setup });
});

app.post('/api/auth/login', validate(authSchema), async (req, res) => {
  const { username, password } = req.body;
  const authData = getAuthData();
  
  const inputPass = String(password).trim();
  const inputUser = String(username).trim();

  if (!authData.setup) {
    if (inputPass === authData.password) {
      return res.json({ token: authData.password, setup: false });
    }
  } else {
    if (inputUser === authData.username && await bcrypt.compare(inputPass, authData.password)) {
      const token = jwt.sign({ username: inputUser }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, setup: true });
    }
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.post('/api/auth/setup', authenticate, validate(setupSchema), async (req, res) => {
  const { username, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  db.prepare('UPDATE auth SET setup = 1, username = ?, password = ? WHERE id = 1').run(username, hashedPassword);
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ success: true, token });
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname))
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

app.post('/api/upload', authenticate, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(err); // Pass Multer errors to Global Handler
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

app.get('/api/articles', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const offset = (page - 1) * limit;

  const rows = db.prepare('SELECT data FROM articles ORDER BY id DESC LIMIT ? OFFSET ?').all(limit, offset);
  const data = rows.map(row => JSON.parse(row.data));
  res.json(data);
});

app.post('/api/articles', authenticate, validate(articleSchema), (req, res) => {
  const id = String(Date.now());
  const newArticle = { id, ...req.body };
  db.prepare('INSERT INTO articles (id, data) VALUES (?, ?)').run(id, JSON.stringify(newArticle));
  res.status(201).json(newArticle);
});

app.put('/api/articles/:id', authenticate, validate(articleSchema), (req, res) => {
  const { id } = req.params;
  const row = db.prepare('SELECT data FROM articles WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Article not found' });
  
  const currentArticle = JSON.parse(row.data);
  const updatedArticle = { ...currentArticle, ...req.body };
  db.prepare('UPDATE articles SET data = ? WHERE id = ?').run(JSON.stringify(updatedArticle), id);
  res.json(updatedArticle);
});

app.delete('/api/articles/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  if (result.changes === 0) return res.status(404).json({ error: 'Article not found' });
  res.json({ success: true });
});

// SPA fallback: Serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  
  // Handle specific Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
    }
    return res.status(400).json({ error: err.message });
  }

  // Handle generic custom errors we explicitly passed from fileFilter
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[NOMUS-SERVER] Running on http://localhost:${PORT}`);
});
