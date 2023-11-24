// import { createFlickr } from "flickr-sdk"
const flickr_sdk = require('flickr-sdk');

const { flickr } = flickr_sdk.createFlickr(process.env.FLICKR_KEY)
// const { flickr } = flickr_sdk.createFlickr({
//     consumerKey: process.env.FLICKR_KEY,
//     consumerSecret: process.env.FLICKR_SECRET,
//     oauthToken: FLICKR_OAUTH_TOKEN,
//     oauthTokenSecret: FLICKR_OAUTH_SECRET,
// })

module.exports = flickr;