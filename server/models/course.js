const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    name: {
        type: String,
        require: true
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

module.exports = mongoose.model('Course', CourseSchema);