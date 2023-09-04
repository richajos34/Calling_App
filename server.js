/* const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Store contestant and husband data in memory (replace with a database in production).
const contestants = [];
const husbands = [];

// Register Contestant/Husband
app.post('/contestants', (req, res) => {
  const { contestantName, husbandName, vocalRange, location } = req.body;

  if (!contestantName || !husbandName || vocalRange === undefined || location === undefined) {
    return res.status(400).json({ error: 'Missing required fields in the request.' });
  }

  // Check if contestant and husband names are unique.
  const isContestantNameUnique = !contestants.some((contestant) => contestant.contestantName === contestantName);
  const isHusbandNameUnique = !husbands.some((husband) => husband.husbandName === husbandName);

  if (!isContestantNameUnique || !isHusbandNameUnique) {
    return res.status(400).json({ error: 'Contestant and husband names must be unique.' });
  }

  // Create and store contestant and husband data.
  const newContestant = {
    contestantName,
    husbandName,
    vocalRange,
    location,
  };
  contestants.push(newContestant);
  husbands.push({ husbandName, location });

  res.status(201).json({ message: 'Contestant and husband registered successfully.' });
});

// Get All Contestants
app.get('/contestants', (req, res) => {
  let pairs = contestants.map((contestant) => ({
    contestantName: contestant.contestantName,
    husbandName: contestant.husbandName,
  }));

  // Industry Checkpoint: Sort by contestantName if sortedByName=true query parameter is provided.
  if (req.query.sortedByName === 'true') {
    pairs = pairs.sort((a, b) => a.contestantName.localeCompare(b.contestantName));
  }

  res.status(200).json({ pairs });
});

// Does the husband call calculation
app.get('/husbandCall/:contestantName', (req, res) => {
    const { contestantName } = req.params;
  
    // Find the contestant by name
    const contestant = contestants.find((c) => c.contestantName === contestantName);
  
    if (!contestant) {
      return res.status(404).json({ error: 'Contestant not found.' });
    }
  
    const { vocalRange, location } = contestant;
  
    // Calculate the score based on the rules
    let score = 0;
  
    if (vocalRange === location) {
      score = location;
    } else if (vocalRange > location) {
      score = abs(vocalRange - location);
    } else {
      return res.status(400).json({ error: 'Vocal range is less than location. Cannot perform husband call.' });
    }
  
    res.status(200).json({ score });
  });

  const uri = "mongodb+srv://richajos24:cochin24@wdbhusbandcalling.grw18mn.mongodb.net/WDB?retryWrites=true&w=majority";

  mongoose
  .connect(uri)
  .then(() => (
    console.log("Connected to database")
  )).catch(() => (
  console.log(error)))

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Contestant = require('./models/contestantModel');

const app = express();
app.use(bodyParser.json());

app.use(express.json());


const uri = "mongodb+srv://richajos24:cochin24@wdbhusbandcalling.grw18mn.mongodb.net/WDB?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Register Contestant/Husband
app.post('/contestants', async (req, res) => {
  const { contestantName, husbandName, vocalRange, location } = req.body;

  try {
    // Create and save the contestant in the database
    const newContestant = new Contestant({
      contestantName,
      husbandName,
      vocalRange,
      location,
    });

    //TODO: Validate if contestant name/ husband is there

    await newContestant.save();

    res.status(201).json({ message: 'Contestant and husband registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register contestant and husband.' });
  }
});

// Get All Contestants
app.get('/contestants', async (req, res) => {
  try {
    const pairs = await Contestant.find({}, 'contestantName husbandName').exec();

    // Industry Checkpoint: Sort by contestantName if sortedByName=true query parameter is provided.
    if (req.query.sortedByName === 'true') {
      pairs.sort((a, b) => a.contestantName.localeCompare(b.contestantName));
    }

    res.status(200).json({ pairs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contestants.' });
  }
});

// Husband Call route (unchanged)
app.get('/husbandCall/:contestantName', async (req, res) => {
    const { contestantName } = req.params;
    console.log("contestant" + contestantName);

    // Find the contestant by name
    const contestant = await Contestant.find({"name" : contestantName});
    console.log("Got contestant" + contestant);
    //const contestant = contestants.find((c) => c.contestantName === contestantName);
  
    if (!contestant) {
      return res.status(404).json({ error: 'Contestant not found.' });
    }
  
    const { vocalRange, location } = contestant;
  
    // Calculate the score based on the rules
    let score = 0;
  
    if (vocalRange === location) {
      score = location;
    } else if (vocalRange > location) {
      score = abs(vocalRange - location);
    } else {
      return res.status(400).json({ error: 'Vocal range is less than location. Cannot perform husband call.' });
    }
  
    res.status(200).json({ score });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
