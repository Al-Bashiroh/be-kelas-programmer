const Course = require('../models/course');

const get = async (req, res) => {
    try {
        const data = await Course.find()
            .sort({ name: 1 })
            .exec();

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get
}