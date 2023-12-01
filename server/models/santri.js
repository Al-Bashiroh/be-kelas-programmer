const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SantriSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    join_date: {
        type: Date,
        require: true,
        default: function() {
            return new Date().setUTCHours(0, 0, 0, 0);
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Santri', SantriSchema);