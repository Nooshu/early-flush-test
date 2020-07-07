const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));

app.get('/with-flush', (req, res) => {
    var startHtml = fs.readFileSync('./views/start.html');
    var endHtml = fs.readFileSync('./views/end.html');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(startHtml);
    res.write(endHtml);
    res.end();
});

app.get('/without-flush', (req, res) => {
    var startHtml = fs.readFileSync('./views/start.html');
    var endHtml = fs.readFileSync('./views/end.html');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(startHtml + endHtml);
    res.end();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));