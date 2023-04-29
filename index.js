const express= require("express");
const {connection}= require("./Config/db");
const {APIRouter}= require("./Routers/api.router")
const cors= require("cors")
require("dotenv").config()
const app=express();

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Home")
})
app.use("/api",APIRouter)
app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connted to DB")
        console.log(`Server is running on ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
})