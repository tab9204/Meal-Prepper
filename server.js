require('dotenv').config({ path: 'keys.env' });
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');
const { Client } = require('pg');
const axios = require('axios');
const compression = require('compression');
const { MongoClient } = require("mongodb");


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);//server client
const db = client.db("meals");//database
const col = db.collection("meal_data");//collection



server.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});

//redirect to https if not already on https
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

//Compress all HTTP responses
app.use(compression());
app.use(express.json());
//serve the assets
app.use('/assets', express.static('assets'));
app.use('/libraries', express.static('libraries'));
app.use('/src', express.static('src'));
app.use('/', express.static('/'));

/***************Server routes***************/
app.get("/",(req,res) =>{
    res.sendFile(__dirname + '/index.html');
});

app.get("/manifest.json",(req,res) =>{
    res.sendFile(__dirname + '/manifest.json');
});

app.get("/service-worker.js",(req,res) =>{
    res.sendFile(__dirname + '/service-worker.js');
});

//uses the spoontacular api to get a list of recipes
app.get('/getRecipes', async (req,res) => {
  try{
     const response = await axios.get("https://api.spoonacular.com/recipes/complexSearch", {params:
       {
         apiKey: process.env.SPOONACULAR_KEY,
         instructionsRequired:true,
         fillIngredients:true,
         addRecipeInformation:true,
         number:10,
         sort:"random",
         type: "main course"
       }
     });
     //send the data to the client
     res.send(response.data);
  }
  catch (error){
    console.log(error);
    res.status("500").send({message: 'Failed to retrieve recipes'});
  }
});

//adds a new recovery entry to the db
app.post('/newRecovery', async (req,res) => {
  try{
    //insert the new recovery entry into the db
    var recovery_doc = {
      "recovery_id":req.body.recovery_id,
      "meals":req.body.meals
    }
    //connect to the db server
    await client.connect();
    //insert the new entry
    await col.insertOne(recovery_doc);
    res.send("New recovery entry added");
  }
  catch (error){
    console.log(error);
    res.status(500).send({message: 'DB operation failed'});
  }
});

//updates an existing recovery entry in the db
app.post('/updateRecovery', async (req,res) => {
  try{
    //connect to the db server
    await client.connect();
    //insert the new entry
    await col.updateOne(
      {"recovery_id":req.body.recovery_id},
      {$set: { 'meals': req.body.meals}}
    );
    res.send("Recovery entry updated");
  }
  catch (error){
    console.log(error);
    res.status(500).send({message: 'DB operation failed'});
  }
});

//recovers a user's data given a recovery id
app.post('/recoverData', async (req,res) => {
  try{
    //insert the new recovery entry into the db
    var recovery_doc = {
      "recovery_id":req.body.recovery_id,
      "meals":req.body.meals
    }
    //connect to the db server
    await client.connect();
    //insert the new entry
    var data = await col.findOne({"recovery_id":req.body.recovery_id});
    if(data == null){
      res.send([]);
    }
    else{
      res.send(data.meals);
    }
  }
  catch (error){
    console.log(error);
    res.status(500).send({message: 'DB operation failed'});
  }
});
