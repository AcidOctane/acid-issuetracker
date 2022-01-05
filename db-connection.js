const mongoose = require('mongoose');
const db = mongoose.connect(process.env.DB, {
  useUnifiedTopology: true;
  useNewUrlParseer: true;
});

module.exports = db;
