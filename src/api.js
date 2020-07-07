const express = require('express');
const app = express();
const serverless = require('serverless-http');
const port = 3000;
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/with-flush', (req, res) => {
    var startHtml = fs.readFileSync('./views/start.html');
    var endHtml = fs.readFileSync('./views/end.html');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(startHtml);
    res.write(endHtml);
    res.end();
});

router.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>This is a test!</h1>');
})

router.get('/without-flush', (req, res) => {
    var startHtml = fs.readFileSync('./views/start.html');
    var endHtml = fs.readFileSync('./views/end.html');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(startHtml + endHtml);
    res.end();
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);