
const mongoose = require('mongoose');

const offerItemSchema = new mongoose.Schema({
    figurines: {
        type: [{
            figurine_id: {
                type: String,
                ref: 'UsersFigurines'
            },
            figurine_name: {
                type: String,
                required: true
            },
            figurine_image_path: {
                type: String,
                required: true
            },
            figurine_ext: {
                type: String,
                required: false,
                default: 'jpg'
            }
        }],
        default: []    
    },
    
    points: {
      type: Number,
      default: 0
    }
  });
  
  const marketplaceOfferSchema = new mongoose.Schema({
    username: {
      type: String,
      ref: 'username',
      required: true
    },
    requesting: offerItemSchema,
    offering: offerItemSchema
  });

  module.exports = mongoose.model('marketplaceOffers', marketplaceOfferSchema);



// const marketplaceOfferSchema = new mongoose.Schema({

//     id_user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'users',
//         required: true
//     },
//     ids_userFigurines: {
//         type: Array,
//         required: true,
//         ref: 'UsersFigurines'
//     },
//     ids_figurine_get: {
//         type: Array,
//         required: true
//     },
//     user_points: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     user_points_get: {
//         type: Number,
//         required: true,
//         default: 0
//     }
// });



  
