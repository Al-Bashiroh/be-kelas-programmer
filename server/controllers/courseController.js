const Course = require('../models/course');

const get = async (req, res) => {
    try {
        var data = await Course.find()
            .sort({ name: 1 })
            .exec();

        data = data.map(c => c.name)

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