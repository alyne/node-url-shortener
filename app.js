const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./config/db');
require('dotenv').config({ path: './config/.env' });

connectDB();

// Body Parser
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/urls'));

// Server Setup
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
