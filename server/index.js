const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
//instantiate express framework
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors());

//routes
const drivers = require("./routes/api/drivers");
const transactions = require("./routes/api/transactions");

//redirect any routes from api/drivers to file routes/api/drivers
app.use("/api/drivers", drivers);

//redirect any routes from api/transactions to file routes/api/transactions
app.use("/api/transactions", transactions);


// open server on port 3000
const port = 4000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
