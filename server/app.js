const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 3000;

app.use(cors());

app.get('/health', (req, res)=>{
    res.status(200).json("SERVER IS LIVE");
})

app.listen(PORT, ()=>{
    console.log(`listening to port: ${PORT}`);
})