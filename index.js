const express = require('express');
const app = express();
const GetPackageVersion = require('./services/GetPackageVersion');

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
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
