const express = require('express');
const app = express();
const GetPackageVersion = require('./services/GetPackageVersion');

require('dotenv').config();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});

app.get('/packages/:packagesNames/latest', async (req, res) => {
  const { packagesNames } = req.params;

  try {
    const packages = [];

    for (const packageName of packagesNames.split(',')) {
      const version = await GetPackageVersion.create().latest(packageName);

      packages.push({
        package: packageName,
        version,
      })
    }

    res.json({ packages });
  } catch (error) {
    console.error('Error fetching package data:', error);

    res.status(500).json({ error: 'Error fetching package version' });
  }
});
