const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    url: {
        type: String
    },
    responsive: {
        type: Boolean,
        default: false
    },
    contributors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Santri'
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    date: {
        type: Date,
        require: true,
        default: function() {
            return new Date().setHours(0, 0, 0, 0);
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

module.exports = mongoose.model('Project', ProjectSchema);