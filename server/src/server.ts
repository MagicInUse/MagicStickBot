import 'dotenv/config';
import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Path resolution
const PUBLIC_PATH = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public_html')
  : path.join(__dirname, '../../client/public_html');

const CERTS_PATH = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../../')
  : path.join(__dirname, '../../');

// Static files
app.use(express.static(PUBLIC_PATH));

// API routes
app.use('/', router);

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, 'index.html'));
});

// Server startup
if (process.env.NODE_ENV !== 'production') {
  const privateKey = fs.readFileSync(path.join(CERTS_PATH, 'private.key'), 'utf8');
  const certificate = fs.readFileSync(path.join(CERTS_PATH, 'certificate.crt'), 'utf8');

  https.createServer({ key: privateKey, cert: certificate }, app)
    .listen(port, () => {
      console.log(`Development server running on https://localhost:${port}`);
    });
} else {
  app.listen(port, () => {
    console.log(`Production server running on port ${port}`);
  });
}