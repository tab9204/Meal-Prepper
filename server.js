require('dotenv').config({ path: 'keys.env' });
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const fs = require('fs');
const { Client } = require('pg');

/*
//database client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

//push notification keys
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;*/

//webPush.setVapidDetails('mailto:nimdhiran@gmail.com', publicVapidKey, privateVapidKey);

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
