const User = require('../models/user');

const getUser = async (req, res) => {
    try {
        const data = await User.find();

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUser
}