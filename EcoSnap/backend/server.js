const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Import Mongoose connection
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/ewastes', require('./routes/ewasteRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'E-Waste Management API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
