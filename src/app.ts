import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Basic cors setup * allow all
app.use(cors());
app.use(express.json({ limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get("/", (_req, res) => {
  res.send("Hello world!")
})

export default app;
