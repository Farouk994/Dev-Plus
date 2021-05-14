const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("<h1>API running well</h1>")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`===> Listening to PORT ${PORT}`)
});