/**
 * Husband Contest API
 *
 * This API allows contestants to register, perform husband calls, and check their scores for the Husband Calling Contest.
 *
 * API Endpoints:
 *
 * - POST /contestants
 *   Registers a new contestant or husband.
 *
 * - GET /contestants
 *   Gets a list of contestants with their names and husband names.
 *
 * - GET /husbandCall/:contestantName
 *   Simulate a "husband call" for a contestant, considering their vocal range, location, and inventory items.
 * 
 * Richa Jos
 * WDB Bootcamp Technical Portion
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Contestant = require('./models/contestantModel');
const PowerItem = require('./models/contestantPowers');

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

// Registers Contestant/Husband Pair
app.post('/contestants', async (req, res) => {
  const { contestantName, husbandName, vocalRange, location } = req.body;

  try {
    const newContestant = new Contestant({
      contestantName,
      husbandName,
      vocalRange,
      location,
    });
    const query = {$or: [{"contestantName" : contestantName}, {"husbandName" : husbandName}]};
    const contestant = await Contestant.findOne(query);

    if(contestant){
     return res.status(400).json({message: 'Contestant/ Husband has already been registered'});
    }

    await newContestant.save();

    res.status(201).json({ message: 'Contestant and husband registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register contestant and husband. Check to see if you are missing any fields \n following the contestantName \n husbandName \n vocalrange \n location \n format' });
  }
});

// Get All Contestant Pairs Sorted Alphabetically
app.get('/contestants', async (req, res) => {
  try {
    let pairs;

    if (req.query.sortedByName === 'true') {
      pairs = await Contestant.find({}, 'contestantName husbandName -_id').sort({ contestantName: 1 }).exec();
    } else {
      pairs = await Contestant.find({}, 'contestantName husbandName -_id').exec();
    }

    res.status(200).json({ pairs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contestants.' });
  }
});




// Call A Contestant/Husband Pair Score
app.get('/husbandCall/:contestantName', async (req, res) => {
    const { contestantName } = req.params;
    console.log("Contestant name " + contestantName);

    const query = {"contestantName" : contestantName};
    const contestant = await Contestant.findOne(query);
    console.log("Got contestant" + contestant);
  
    if (!contestant) {
      return res.status(404).json({ error: 'Contestant not found.' });
    }
  
    const { vocalRange, location } = contestant;

    let score = 0;
  
    if (vocalRange === location) {
      score = location;
    } else if (vocalRange > location) {
      score = Math.abs(vocalRange - location);
    } else {
      return res.status(400).json({ error: 'Vocal range is less than location. Cannot perform husband call.' });
    }

    const updateDoc = {
      $set: {
        score: score
      },
    };
    const result = await Contestant.updateOne(query, updateDoc, null);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
    res.status(200).json({ score });
});

// INDUSTRY (not complete but I tried)
// Buy Power Item (incomplete)
app.post('/buyItem/:contestantName', async (req, res) => {
  const {contestantName} = req.params;
  const {item, boost} = req.body;

  try {
    // Create and save the contestant in the database
    const newPowerItem = new PowerItem({
      contestantName,
      item,
      boost
    });

    // Validate if contestant already has the item
    const query = {$and: [{"contestantName" : contestantName}, {"item" : item}]};
    const powerItem = await PowerItem.findOne(query);

    if(powerItem){
     return res.status(400).json({message: 'Contestant already has the power up'});
    }

    await newPowerItem.save();

    res.status(201).json({ message: 'Contestant bought the item successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Item is out of stock' });
  }
});

// Get Highest Scoring Contestant (incomplete)
app.get('/bestShout', async (req, res) => {
  try {
    const highestShout = await Contestant.findOne({}, 'contestantName score -_id').sort({ score: -1 }).limit(1).exec();

    if (!highestShout) {
      return res.status(404).json({ error: 'No contestants found.' });
    }

    console.log("highestShout " + highestShout);

    res.status(200).json({ highestShout });
  } catch (error) {
    console.error('Error fetching highest score from contestants:', error);
    res.status(500).json({ error: 'Failed to fetch highest score from contestants.' });
  }
});



// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
