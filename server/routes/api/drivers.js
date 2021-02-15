const express = require("express");
const mongodb = require("mongodb")
const router = express.Router();
var ObjectId = require('mongodb').ObjectId;

//list drivers
router.get("/", async (req, res) => {
    const drivers = await loadDriversCollection();
    var sort = req.query.sort;
    var order = parseInt(req.query.order);
    var skip = parseInt(req.query.skip);
    var limit = parseInt(req.query.limit);
    var mysort = {};
    mysort[sort] = order;
    res.send(await drivers.find({}).sort(mysort).skip(skip).limit(limit).toArray());
});

//select single driver
router.get("/:id", async (req, res) => {
    const drivers = await loadDriversCollection();
    var selectedDriver = await drivers.findOne({ _id: ObjectId(req.params.id) });
    res.status(200).send(selectedDriver);
});

//create driver
router.post("/", async (req, res) => {
    const drivers = await loadDriversCollection();
    await drivers.insertOne({
        name: req.body.name,
        team: req.body.team,
        price: parseInt(req.body.price),
        isOnSale: req.body.isOnSale
    });
    res.status(201).send();
});

//update driver
router.patch("/:id", async (req, res) => {
    const drivers = await loadDriversCollection();
    var newDriverData = {
        name: req.body.name,
        team: req.body.team,
        price: req.body.price,
        isOnSale: req.body.isOnSale
    };
    await drivers.updateOne({ _id: ObjectId(req.params.id) }, { $set: newDriverData });
    res.status(200).send();
});

//delete driver
router.delete("/:id", async (req, res) => {
    const drivers = await loadDriversCollection();
    await drivers.deleteOne({ _id: ObjectId(req.params.id) });
    return res.status(204).send();
});

async function loadDriversCollection() {
    const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
        { useNewUrlParser: true },
        { useUnifiedTopology: true }
    );
    return client.db("racing_team_italia").collection("drivers");
}
module.exports = router;