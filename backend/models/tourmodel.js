const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'tour must have price']
  },

  durations:{
    type:Number,
    require:[true,'A tour must have duration']
  },

 maxGroupsize:{
    type:Number,
    require:[true,'A tour must have duration']
  },
  rating: {
    type: Number,
    default: 4.5
  }
});

// Schema model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
