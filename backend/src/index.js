const express = require('express');
const cors = require('cors');
const schedulingRoutes = require('./routes/scheduling');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', schedulingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'OS Process Lifecycle Visualizer API' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

module.exports = app;
