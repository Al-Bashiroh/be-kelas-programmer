const Santri = require('../models/santri');
// const flickr = require('../config/flickr')

const get = async (req, res) => {
    try {
        const perPage = parseInt(req.query.perpage) || 10;
        const page = parseInt(req.query.page) || 1;

        // const santries = await Santri.find();
        const data = await Santri.aggregate([ { $sort: { firstname: 1 }} ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Santri.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const from = data.length ? perPage * page - perPage + 1 : 0;
        const to = data.length ? from + data.length - 1 : 0;
        const maxPage = Math.ceil(count / perPage);

        // const photo = await flickr("flickr.photos.getInfo", {
        //     photo_id: '53351486615',
        // })

        res.json({
            data,
            // photo,
            currentPage: page,
            prevPage: page != 1 ? page - 1 : null,
            nextPage: hasNextPage ? nextPage : null,
            maxPage,
            from,
            to,
            total: count
        });
    } catch (error) {
        console.log(error);
    }
}

const getById = async (req, res) => {
    try {
        const _id = req.params._id;

        const data = await Santri.findById(_id);

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({error: "Not found!"});
    }
}

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
        const _id = req.body._id;
        const body = req.body;

        // update and get the new saved data
        const santri = await Santri.findByIdAndUpdate(_id, {
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
        const _id = req.body._id;

        // 2 ways of delete
        // await Santri.findByIdAndDelete(req.body.id);
        await Santri.deleteOne({ _id })

        res.json({
            message: "SUCCESS"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get,
    getById,
    create,
    update,
    destroy
}