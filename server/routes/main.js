const express = require('express');
const router = express.Router();
const Santri = require('../models/santri');

// ROUTES
router.get('/', async (req, res) => {
    res.send({
        name: "Hallow BROW"
    });
});

// GET SANTRI
router.get('/santri', async (req, res) => {
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

        res.json({
            data,
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
});

// GET SANTRI BY ID
router.get('/santri/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Santri.findById(id);

        res.json({
            data
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({error: "Not found!"});
    }
});

module.exports = router;