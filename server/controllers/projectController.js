const Project = require('../models/project');
const Santri = require('../models/santri')
const Course = require('../models/course')

const get = async (req, res) => {
    try {
        const perPage = parseInt(req.query.perpage) || 10;
        const page = parseInt(req.query.page) || 1;

        const data = await Project.aggregate([
            { $sort: { date: -1 }},
            {
                $lookup: {
                    from: 'santris', // Assuming the collection name is 'users'
                    localField: 'contributors',
                    foreignField: '_id',
                    as: 'contributors'
                }
            },
            {
                $lookup: {
                    from: 'courses', // Assuming the collection name is 'users'
                    localField: 'courses',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $sort: { name: 1 } // Sort by name alphabetically
                        }
                    ],
                    as: 'courses'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    date: 1,
                    url: 1,
                    responsive: 1,
                    contributors: 1,
                    courses: '$courses.name' // Extract only the 'name' field from 'coursesData',
                }
            },
            // { $skip: perPage * page - perPage },
            // { $limit: perPage }
        ]);

        const count = await Project.countDocuments();
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
}

const getById = async (req, res) => {
    try {
        const _id = req.params._id;

        const data = await Project.findById(_id).populate('contributors');

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

        // get santries id by fecth to make sure santri is exist
        const contributorIds = body.contributors;

        const santris = await Santri.find({ _id: { $in: contributorIds } });
        const contributors = santris.map(s => s._id);

        // get courses by name or create new one if not exist
        const courseNames = body.courses;
        const courses = await Promise.all(
            courseNames.map(async courseName => {
                const course = await Course.findOneAndUpdate(
                    { name: courseName.toUpperCase() },
                    { $setOnInsert: { name: courseName.toUpperCase() } },
                    { upsert: true, new: true }
                );

                return course._id;
            })
        );

        const newProject = new Project({
            title: body.title,
            url: body.url,
            responsive: body.responsive,
            date: new Date(body.date),
            contributors: contributors,
            courses: courses
        });
        const data = await Project.create(newProject);

        res.json({
            message: "SUCCESS",
            data
        });
    } catch (error) {
        console.log(error);
    }
}

const update = async (req, res) => {
    try {
        const _id = req.body._id;
        const body = req.body;

        // get santries id by fecth to make sure santri is exist
        const contributorIds = body.contributors;

        const santris = await Santri.find({ _id: { $in: contributorIds } });
        const contributors = santris.map(s => s._id);

        // get courses by name or create new one if not exist
        const courseNames = body.courses;
        const courses = await Promise.all(
            courseNames.map(async courseName => {
                const course = await Course.findOneAndUpdate(
                    { name: courseName.toUpperCase() },
                    { $setOnInsert: { name: courseName.toUpperCase() } },
                    { upsert: true, new: true }
                );

                return course._id;
            })
        );

        // update and get the new saved data
        const project = await Project.findByIdAndUpdate(_id, {
            title: body.title,
            url: body.url,
            responsive: body.responsive,
            date: new Date(body.date),
            contributors: contributors,
            courses: courses,
            updatedAt: Date.now()
        }, { new: true });

        res.json({
            message: "SUCCESS",
            data: project
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
        await Project.deleteOne({ _id })

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