const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recentRouter = require('./routes/recent');
const searchRouter = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/recent', recentRouter);
app.use('/search', searchRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});