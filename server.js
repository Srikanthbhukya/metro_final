require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoute = require('./routes/authRoute')
const stationRoute = require('./routes/stationRoute')
const adminRoute = require('./routes/adminRoute')

const app = express();
const PORT = process.env.PORT || 8000;

// app.use(express.static('public'));
app.use(express.json());
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true
}));
// app.use((req, res, next) => {
//     req.adjacencyList = g.adjacencyList;
//     req.stations = g.stations;
//     req.root = root;
//     next();
// });

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

app.get('/', (req, res) => {
    res.send("Hello from the backend");
});

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/', stationRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
