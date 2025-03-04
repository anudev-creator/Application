// const next = require("next");
// const express = require("express");
// const https = require("https");
// const fs = require("fs");
// const path = require("path");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();


//   server.use(express.static(path.join(__dirname, ".next")));


//   server.all("*", (req, res) => {
//     return handle(req, res);
//   });


  // const options = {
  //   key: fs.readFileSync("/etc/letsencrypt/live/astraliva.com/privkey.pem"),
  //   cert: fs.readFileSync("/etc/letsencrypt/live/astraliva.com/fullchain.pem"),
  // };


//   https.createServer(options, server).listen(3000, (err) => {
//     if (err) throw err;
//     console.log("> Ready on https://localhost:3000");
//   });
// });
require('dotenv').config();
const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 1122;

app.prepare().then(() => {
  const server = express();

  server.use(express.static(path.join(__dirname, '..', '.next')));


  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:'+PORT);
  });
});
