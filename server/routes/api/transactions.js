const express = require("express");
const mongodb = require("mongodb")
const router = express.Router();
var ObjectId = require('mongodb').ObjectId;

//list transactions
router.get("/", async (req,res)=>{
    const transactions = await loadTransactionsCollection();
    var skip = parseInt(req.query.skip);
    var limit = parseInt(req.query.limit);
    res.send(await transactions.find({}).sort({"createdAt": 1}).skip(skip).limit(limit).toArray());
});

//select single transaction
router.get("/:id", async (req,res)=>{
    const transactions = await loadTransactionsCollection();
    var thisTransaction = await transactions.findOne({_id:ObjectId(req.params.id)});
    res.status(200).send(thisTransaction);
});

//create transaction
router.post("/", async(req, res)=>{
    const transactions = await loadTransactionsCollection();
    await transactions.insertOne({
        driver : req.body.driver,
        from : req.body.from,
        to : req.body.to,
        pricePaid : req.body.pricePaid,
        percentage : req.body.percentage,
        createdAt : new Date()
    });
    res.status(201).send();
});

//update transaction
router.patch("/:id", async(req,res)=>{
    const transactions = await loadTransactionsCollection();
    var newDriverData = {
        driver : req.body.driver,
        from : req.body.from,
        to : req.body.to,
        pricePaid : req.body.pricePaid,
        percentage : req.body.percentage,
        createdAt : new Date()
    };
    await transactions.updateOne({_id: ObjectId(req.params.id)}, { $set: newDriverData });
    res.status(200).send();
});

//delete transaction
router.delete("/:id", async(req,res)=>{
    const transactions = await loadTransactionsCollection();
    await transactions.deleteOne({_id:ObjectId(req.params.id)});
    return res.status(204).send();
});

async function loadTransactionsCollection() {
    const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
    {useNewUrlParser: true},
    {useUnifiedTopology: true}
    );
    return client.db("racing_team_italia").collection("transactions");
}

module.exports = router;