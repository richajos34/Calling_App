const mongoose = require('mongoose');

// Define Contestant Schema and Model
const powerSchema = new mongoose.Schema({
    contestantName: { type: String, unique: false, required: true },
    item: {type: String, required: true},
    boost: {type: Number, required: true}
  });
  
  const PowerItem = mongoose.model('PowerItem', powerSchema);

  module.exports = PowerItem;
