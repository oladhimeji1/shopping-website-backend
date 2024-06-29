const express = require ("express");
const router = require ("./route/route");
var cors = require("cors");

const app = express();

app.use(cors());
const port = process.env.Port || 8080;

  // Express midleware
app.use(express.urlencoded({extended: true,}));
app.use(express.json());

app.use("/", router);


app.listen(port, () => {
  console.log(`Server is running on PORT ${port} `);
});