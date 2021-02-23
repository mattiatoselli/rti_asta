const express = require("express");
const mongodb = require("mongodb")
const router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const teamsNames = ["Racing Team Italia", "Volanti ITR", "MySubito Casa", "A24", "Scuderia Prandelli", "Virtual Racing", "3DRAP", "Rookies"];

//list drivers
router.get("/", async (req,res)=>{
    try{
        //we return all the drivers since they are only 80 at its maximum, should not be so heavy for the system
        const drivers = await loadDriversCollection();
        res.send(await drivers.find({}));
    } catch(err) {
        res.status(500).send(err.message);
    }
});

//select single driver
router.get("/:id", async (req,res)=>{
    try {
        const drivers = await loadDriversCollection();
        var selectedDriver = await drivers.findOne({_id:ObjectId(req.params.id)});
        res.status(200).send(selectedDriver);
    } catch(err) {
        res.status(500).send(err.message);
    }
});

//create driver
router.post("/", async(req, res)=>{
    try {
        //let us validate the request
        if(req.body.name == "" || req.body.name == null || req.body.name == undefined) throw "Provide a driver name";
        if(req.body.name.length > 5) throw "Driver's name must be at least 5 letters";
        if(req.body.team == null || req.body.team == "" || req.body.team == undefined) throw "Provide a team";
        if(!teamsNames.includes(req.body.team)) throw "This team name is not available";
        if(req.body.price == null || req.body.price == "" || req.body.price == undefined || req.body.price < 0) throw "Provide a fair price for the driver";
        if(req.body.price == 0 && req.body.isOnSale) throw "Can't create a driver with 0 as price if he is on sale";
        
        const drivers = await loadDriversCollection();
        await drivers.insertOne({
            name : req.body.name,
            team: req.body.team,
            price : req.body.price,
            isOnSale : req.body.isOnSale
        });
        res.status(201).send();
    } catch(err) {
        res.status(500).send(err.message);
    }
});

//update driver
router.patch("/:id", async(req,res)=>{
    try {
        //let us validate the request
        if(req.body.name == "" || req.body.name == null || req.body.name == undefined) throw "Provide a driver name";
        if(req.body.name.length > 5) throw "Driver's name must be at least 5 letters";
        if(req.body.team == null || req.body.team == "" || req.body.team == undefined) throw "Provide a team";
        if(!teamsNames.includes(req.body.team)) throw "This team name is not available";
        if(req.body.price == null || req.body.price == "" || req.body.price == undefined || req.body.price < 0) throw "Provide a fair price for the driver";
        if(req.body.price == 0 && req.body.isOnSale) throw "Can't create a driver with 0 as price if he is on sale";
        const drivers = await loadDriversCollection();
        var newDriverData = {
            name : req.body.name,
            team: req.body.team,
            price : req.body.price,
            isOnSale : req.body.isOnSale
        };
        await drivers.updateOne({_id: ObjectId(req.params.id)}, { $set: newDriverData });
        res.status(200).send();
    } catch(err) {
        res.status(500).send(err.message);
    }
});

//delete driver
router.delete("/:id", async(req,res)=>{
    try {
        const drivers = await loadDriversCollection();
        await drivers.deleteOne({_id:ObjectId(req.params.id)});
        return res.status(204).send();
    } catch(err) {
        res.status(500).send(err.message);
    }
});

async function loadDriversCollection() {
    const client = await mongodb.MongoClient.connect("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
        { useNewUrlParser: true },
        { useUnifiedTopology: true }
    );
    return client.db("racing_team_italia").collection("drivers");
}
module.exports = router;