const express = require("express");
const connectDB = require("./config/db");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect Database
connectDB();

app.get("/", (req,res)=>{
    res.send("<h1>API running well</h1>")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`===> Listening to PORT ${PORT}`)
});