
const mongoose = require('mongoose');
const bcrypt = require('@node-rs/bcrypt');


const userFigurineSchema = new mongoose.Schema({
      id_user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
      },
      id_figurine: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image_path: {
        type: String,
        required: true
      },
      ext: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      appearances: {
        type: Array,
        required: true
      }
});



/* check that doesn't already exsits such an offer or an opposite offer*/



module.exports = mongoose.model('UserFigurine', userFigurineSchema);