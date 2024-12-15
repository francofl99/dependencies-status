const express = require('express');
const app = express();
const GetPackageVersion = require('../services/GetPackageVersion');
const path = require('path');

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static('public'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (_req, res) => {
  res.render('dependencies', { dependencies: [] });
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

    res.status(200).json({ packages });
  } catch (error) {
    console.error('Error fetching package data:', error);

    res.status(500).json({ error: 'Error fetching package version' });
  }
});

module.exports = app;
