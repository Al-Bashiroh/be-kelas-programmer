const Santri = require('../models/santri');

const create = async (req, res) => {
    try {
        const body = req.body;
        const newSantri = new Santri({
            firstname: body.firstname,
            lastname: body.lastname,
            gender: body.gender
        });
        const santri = await Santri.create(newSantri);

        res.json({
            message: "SUCCESS",
            data: santri
        });
    } catch (error) {
        console.log(error);
    }
}

const update = async (req, res) => {
    try {
        const body = req.body;

        // update and get the new saved data
        const santri = await Santri.findByIdAndUpdate(body.id, {
            firstname: body.firstname,
            lastname: body.lastname,
            gender: body.gender,
            updatedAt: Date.now()
        }, { new: true });

        res.json({
            message: "SUCCESS",
            data: santri
        });
    } catch (error) {
        console.log(error);
    }
}

const destroy = async (req, res) => {
    try {
        // 2 ways of delete
        // await Santri.findByIdAndDelete(req.body.id);
        await Santri.deleteOne({ _id: req.body.id })

        res.json({
            message: "SUCCESS"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    create,
    update,
    destroy
}