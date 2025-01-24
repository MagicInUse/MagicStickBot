import 'dotenv/config';
import express from 'express';
import https from 'https';
import fs from 'fs';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.get('/', (_req, res) => {
  res.send(`
    <html>
      <body>
        <button onclick="window.location.href='/twitch/login'">Log in with Twitch</button>
      </body>
    </html>
  `);
});

app.get('/dashboard', (_req, res) => {
  res.send('Welcome to your dashboard!');
});

let privateKey: string;
let certificate: string;

if (process.env.NODE_ENV != 'production') {
  privateKey = fs.readFileSync('../private.key', 'utf8');
  certificate = fs.readFileSync('../certificate.crt', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
  });
}
else {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}