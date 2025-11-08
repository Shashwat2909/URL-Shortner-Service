import express from "express";
import "dotenv/config";
import connectDB from "./config/db.ts";
import urlRoutes from "./routes/urls.ts";
import url from "./models/url.ts";
import indexRoutes from "./routes/index.ts";
import authRoutes from "./routes/auth.ts";
import linksRoute from "./routes/links.ts"

// Connect to Database
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', urlRoutes);
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linksRoute)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is alive and running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
