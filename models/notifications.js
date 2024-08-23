const mongoose = require('mongoose');
const bcrypt = require('@node-rs/bcrypt');

const notiSchema = new mongoose.Schema({

    r_user_id: { type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref: 'users'
    },

    s_user_id: { type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'users'
    },

    type: { type: String,
        required:true 

    },

    id_request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'marketplaceOffers'
    }
})

module.exports = mongoose.model('notifications', notiSchema);