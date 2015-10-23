#!/usr/bin/env node
var express = require('express');
var path = require('path');

var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 8000;

server.listen(port, function() {
  console.log('Running on port: ', port);
});

var staticPath = path.join(__dirname, '../client');
app.use(express.static(staticPath));
