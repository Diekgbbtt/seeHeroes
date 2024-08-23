const mongoose = require('mongoose');
const bcrypt = require('@node-rs/bcrypt');

const packetsSchema = new mongoose.Schema({

    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    type: {
        type: String,
        required: true
    },
    
    boughtAt: {
        type: String, default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
        required: false
    }

});

module.exports = mongoose.model('packets', packetsSchema);