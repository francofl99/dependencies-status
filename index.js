const express = require('express');
const app = express();
const axios = require('axios');

require('dotenv').config();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});

app.get('/packages/:packageName/latest', async (req, res) => {
  const { packageName } = req.params;

  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}/latest`);

    const latestVersion = response.data.version;

    res.json({ package: packageName, version: latestVersion });
  } catch (error) {
    console.error('Error fetching package data:', error);

    res.status(500).json({ error: 'Error fetching package version' });
  }
});
