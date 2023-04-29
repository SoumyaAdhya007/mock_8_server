const express=require("express")
const {UserModel}=require("../Models/user.model")
const {OrderModel}=require("../Models/order.model")
const {RestaurantModel}=require("../Models/restaurant.model")
const {Auth}=require("../Middleware/auth.middleware")
const jwt=require("jsonwebtoken");
require("dotenv").config()
const bcrypt=require("bcrypt");

const APIRouter=express.Router();

APIRouter.post("/register", async(req,res)=>{
    try {
        const {name,email,password,address: {street,city,state,country,zip}}=req.body;
        if(!name||!email||!password||!street||!city||!state||!country||!zip){
          return  res.status(400).send({msg:"Please Provide All Details"})
        }
        const findUser= await UserModel.findOne({email});
        if(findUser){
          return  res.status(400).send({msg:"User is already registerd"})
        }
        bcrypt.hash(password,+process.env.soltRounds, async(err,hash_pass)=>{
            if(err){
                return res.status(400).send({msg:err})
            }
            const user= new UserModel({
                name,email,password:hash_pass,address: {street,city,state,country,zip}
            })
            await user.save()
            res.status(201).send({msg:"User Registerd"})
        })
    } catch (error) {
        res.status(404).send({msg:er})
    }
})
APIRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
    if(!email||!password){
        return  res.status(400).send({msg:"Please Provide All Details"})

    }
    const findUser= await UserModel.findOne({email});
    if(!findUser){
      return  res.status(400).send({msg:"User is not found"})
    }
    bcrypt.compare(password, findUser.password, async(err,result)=>{
            if(err){
                return res.status(400).send({msg:err})
            }
            if(!result){
                return res.status(400).send({msg:"Worng Cred"})
            }
            if(result){
                let token= jwt.sign({id:findUser._id},process.env.key);
                return res.status(201).send({msg:"User Login",token})

            }
       
        })
    }
    catch (error) {
        res.status(404).send({msg:er})
            
    }
})
APIRouter.patch("/user/:id/reset", async(req,res)=>{
    const {password, new_password}=req.body;
    const id= req.params.id;
    try {
        if(!password||!new_password){
        return  res.status(400).send({msg:"Please Provide All Details"})
        }
        const findUser= await UserModel.findOne({_id:id})
        if(!findUser){
            return  res.status(400).send({msg:"User is not found"})
          }

        bcrypt.compare(password, findUser.password, async(err,result)=>{
            if(err){
                return res.status(400).send({msg:err})
            }
        if(result){
            bcrypt.hash(new_password,+process.env.soltRounds, async(err,hash_pass)=>{
                if(err){
                    return res.status(400).send({msg:err})
                }
                await UserModel.findByIdAndUpdate({_id:id},{password:hash_pass})

                res.status(204).send({msg:"Password Updated"})
            })

        }
        })
        
    } catch (error) {
        res.status(404).send({msg:er})
        
    }
})
APIRouter.get("/restaurants", async(req,res)=>{
    try {
        const restaurants= await RestaurantModel.find();
        res.status(200).send(restaurants)
    } catch (error) {
        res.status(404).send({mag:error})
    }
})
APIRouter.get("/restaurants/:id", async(req,res)=>{
    const id= req.params.id;
    try {
        const restaurants= await RestaurantModel.find({_id:id});
        res.status(200).send(restaurants)
    } catch (error) {
        res.status(404).send({mag:error})
    }
})
APIRouter.get("/restaurants/:id/menu", async(req,res)=>{
    const id= req.params.id;
    try {
        const restaurants= await RestaurantModel.findOne({_id:id});
        const menu=restaurants.menu;
        console.log(menu)
        res.status(200).send(menu)
    } catch (error) {
        res.status(404).send({mag:error})
    }
})
APIRouter.post("/orders",Auth, async(req,res)=>{
    const {restaurant,items: [
        {
        name,
        price,
        quantity
      }
      ],
      deliveryAddress: {
        street,
        city,
        state,
        country,
        zip
      },
      status
     }= req.body;
    const user= req.body.userId
    try {
        if(!restaurant||!name||!price||!quantity||!street||!city||!state||!country||!zip||!status){
        return  res.status(400).send({msg:"Please Provide All Details"})
        }
        const order= new OrderModel({
            user,
            restaurant,
            items: [
                {
                name,
                price,
                quantity
              }
              ],
              totalPrice:quantity*price,
              deliveryAddress: {
                street,
                city,
                state,
                country,
                zip
              },
              status
        })
        await order.save();
        res.status(201).send("Order Added")
    } catch (error) {
        res.status(404).send({mag:error})
    }
})
APIRouter.get("/orders/:id",async(req,res)=>{
    const id=req.params.id;
    try {
        const orders= await OrderModel.find({_id:id});
        res.status(200).send(orders)
    } catch (error) {
        res.status(404).send({mag:error})
        
    }
})
APIRouter.patch("/orders/:id",Auth, async(req,res)=>{
    const id=req.params.id;

    const {status}=req.body;
    try {
        await OrderModel.findByIdAndUpdate({_id:id},{status:status})
    } catch (error) {
        res.status(404).send({mag:error})
        
    }
})
 module.exports={
    APIRouter
 }