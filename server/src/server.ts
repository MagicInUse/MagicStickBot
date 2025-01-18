import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, MagicStickBot!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});