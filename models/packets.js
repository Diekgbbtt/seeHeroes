const mongoose = require('mongoose');
const bcrypt = require('@node-rs/bcrypt');

const packetsSchema = new mongoose.Schema({

    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    type: {
        type: Number,
        required: true
    },
    
    boughtAt: {
        type: Date,
        required: false
    }
});