import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
const { Pool } = pg;
import { z } from 'zod';
import crypto from 'crypto';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 login attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' }
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "/uploads/", "/assets/", "https://nomus-film-cms.onrender.com", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://nomus-film-cms.onrender.com"],
    },
  },
}));

const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_PASSWORD = crypto.randomBytes(8).toString('hex');
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] No JWT_SECRET found in env. Sessions will be invalidated on server restart.');
}

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(bodyParser.json());
app.use('/api/', limiter);

// Serve static files from Vite build
app.use(express.static(DIST_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// Initialize directories
fs.ensureDirSync(UPLOADS_DIR);

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
});

// Setup Database Schema
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        data JSONB
      );
      CREATE TABLE IF NOT EXISTS auth (
        id SERIAL PRIMARY KEY,
        setup BOOLEAN DEFAULT FALSE,
        username TEXT,
        password TEXT
      );
    `);

    // Support for remote admin reset via Environment Variable
    if (process.env.RESET_ADMIN === 'true') {
      await pool.query('UPDATE auth SET setup = FALSE WHERE id = 1');
      console.log('[SECURITY] Admin account reset triggered by RESET_ADMIN environment variable.');
    }

    // Initialize Auth
    const res = await pool.query('SELECT * FROM auth WHERE id = 1');
    let authData = res.rows[0];
    
    if (!authData) {
      await pool.query('INSERT INTO auth (id, setup, username, password) VALUES (1, FALSE, $1, $2)', ['', DEFAULT_PASSWORD]);
      const resRetry = await pool.query('SELECT * FROM auth WHERE id = 1');
      authData = resRetry.rows[0];
    }
    
    if (!authData.setup) {
      console.log('\n=============================================');
      console.log('[SECURITY] System needs setup.');
      console.log(`[SECURITY] Temporary Admin Password: ${authData.password}`);
      console.log('=============================================\n');
    }
  } catch (err) {
    console.error('[DB Init Error]', err);
  }
};

initDB();

const getAuthData = async () => {
  const res = await pool.query('SELECT * FROM auth WHERE id = 1');
  return res.rows[0];
};

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
  type: z.enum(['news', 'portfolio', 'partner']).default('news')
});

// Middleware: Authenticate
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  const authData = await getAuthData();

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

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: err.message });
  }
});

app.get('/api/auth/status', async (req, res) => {
  const authData = await getAuthData();
  res.json({ setup: authData?.setup || false });
});

app.post('/api/auth/login', authLimiter, validate(authSchema), async (req, res) => {
  const { username, password } = req.body;
  const authData = await getAuthData();
  
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

app.post('/api/auth/setup', authLimiter, authenticate, validate(setupSchema), async (req, res) => {
  const { username, password } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('UPDATE auth SET setup = TRUE, username = $1, password = $2 WHERE id = 1', [username, hashedPassword]);
  
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
    if (err) return next(err); 
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

app.get('/api/articles', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query('SELECT data FROM articles ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
    res.json(result.rows.map(row => row.data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/articles', authenticate, validate(articleSchema), async (req, res) => {
  const id = String(Date.now());
  const newArticle = { id, ...req.body };
  try {
    await pool.query('INSERT INTO articles (id, data) VALUES ($1, $2)', [id, newArticle]);
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/articles/:id', authenticate, validate(articleSchema), async (req, res) => {
  const { id } = req.params;
  try {
    const checkRes = await pool.query('SELECT data FROM articles WHERE id = $1', [id]);
    if (checkRes.rowCount === 0) return res.status(404).json({ error: 'Article not found' });
    
    const updatedArticle = { ...checkRes.rows[0].data, ...req.body };
    await pool.query('UPDATE articles SET data = $1 WHERE id = $2', [updatedArticle, id]);
    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/articles/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM articles WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SPA fallback: Serve index.html for all non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[NOMUS-SERVER] Running on http://localhost:${PORT}`);
});