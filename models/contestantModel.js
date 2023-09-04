const mongoose = require('mongoose');

// Define Contestant Schema and Model
const contestantSchema = new mongoose.Schema({
    contestantName: { type: String, unique: true, required: true },
    husbandName: { type: String, unique: true, required: true },
    vocalRange: { type: Number, required: true },
    location: { type: Number, required: true },
  });
  
  const Contestant = mongoose.model('Contestant', contestantSchema);

  module.exports = Contestant;
