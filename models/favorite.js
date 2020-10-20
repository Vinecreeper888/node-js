const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dishes: [{
    mongoose.Schema.Types.ObjectId,
    ref: 'Dish'
  }]
},{
  timestamps: true
});

//construct model
const Favorites = mongoose.model('Favorite',favoriteSchema);

module.exports = Favorites;
