const mongoose = require('mongoose');
const Thread = require('./thread');

require('dotenv').config()

// mongoose.set('debug', true);
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.DB, {
  keepAlive: true,
  useNewUrlParser: true
});

exports.Thread = Thread;
