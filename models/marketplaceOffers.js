
const mongoose = require('mongoose');
const bcrypt = require('@node-rs/bcrypt');
const { listIndexes } = require('./users');


const marketplaceOfferSchema = new mongoose.Schema({

    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    ids_userFigurines: {
        type: Array,
        required: true,
        ref: 'UsersFigurines'
    },
    ids_figurine_get: {
        type: Array,
        required: true
    },
    id_serie: {
        type: Number,
        required: true
    }
    /* there could be more figurines in the exchange belonging to different comics, tehse go in
     a separate section 'mixed'*/
});