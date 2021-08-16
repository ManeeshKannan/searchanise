const firebase = require("../DataBase");
const client = require("../redis");
const axios = require("axios");
const productModels = require("../models/ProductModels");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { promisify } = require("util");

//const SEARCHANISE_API_KEY = "6o9f6w2g0N";
const FIREBASE_COLLECTION = "ApplicatioID";
const Get_Async = promisify(client.get).bind(client);

exports.getProductFromSearchise = catchAsync(async(req, res, next) => {
    const AppId = req.query.AppId; //firstStore

    if (!APIFeatures) {
        return next(new AppError("No AppId found. Please enter AppId", 404));
    }

    //search SEARCHANISE_API_KEY in redis databse
    let SEARCHANISE_API_KEY = await Get_Async(AppId);

    //if SEARCHANISE_API_KEY is not in redis it search in realtime database
    if (!SEARCHANISE_API_KEY) {
        const ref = firebase.ref(FIREBASE_COLLECTION);
        const doc = await ref.child(AppId).get();
        SEARCHANISE_API_KEY = doc.val();

        if (!SEARCHANISE_API_KEY)
            return next(new AppError("No App found with that ID", 404));

        // https://www.epochconverter.com/
        // to fetch current epoach time
        let currentEpoachTime = Math.floor(+new Date() / 1000);
        // expire in 10 seconds
        let expireEpoachTime = currentEpoachTime + 10000;

        //saving data in redis
        const saveResult = await client.set(AppId, SEARCHANISE_API_KEY); //, 'EX', expireEpoachTime)
        client.expireat(AppId, expireEpoachTime);
    }
    const facets = "&facets=" + true;
    const searchanise_url =
        `https://www.searchanise.com/getresults?apiKey=${SEARCHANISE_API_KEY}` +
        facets;

    const URL = await new APIFeatures(searchanise_url, req.query)
        .searchTerms()
        .sort()
        .paginate()
        .filter();
    //console.log(URL[0]);

    await axios.get(URL[0]).then((response) => {
        const data = response.data.items;
        const products = productModels.products(data);

        let filters = "";
        if (response.data.facets) {
            const facet = response.data.facets;
            filters = productModels.filter(facet);
        }
        res.status(200).json({
            platform: "Shopify",
            hasFilter: URL[1],
            filters,
            products,
        });
    });
});