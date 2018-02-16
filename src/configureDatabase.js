const mongoose = require('mongoose');

async function connectDatabase({ connectionString }){
  await mongoose.connect(connectionString);
}

module.exports = {
  connectDatabase,
};
