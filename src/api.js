const express = require('express');
const app = express();
const serverless = require('serverless-http');
const port = 3000;
const path = require('path');
const fs = require('fs');
const router = express.Router();

let startHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Testing the flush mechanism</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
    function mySlowFunction(baseNumber) {
      console.time('mySlowFunction');
      let result = 0;	
      for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {		
          result += Math.atan(i) * Math.tan(i);
      };
      console.timeEnd('mySlowFunction');
    }
    </script>
    <script>mySlowFunction(13);</script>
</head>`;

let endHtml = `  <body>
<header class="site-header">
  <div class="wrapper">
    <h1 class="site-header__heading">
      <a href="/">Matt Hobbs</a>
    </h1>
    <nav class="site-header__nav">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/blog">Blog</a></li>
      </ul>
    </nav>
  </div>
</header>

<main class="site-main">
  <script>mySlowFunction(13);</script>
  <h2>This is a flush test</h2>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo ratione expedita quos hic tempora quas qui reprehenderit ad numquam officia ducimus voluptas perferendis doloremque aspernatur pariatur vel, quaerat similique incidunt?</p>
</main>

<footer class="site-footer">
  &copy; Test footer
</footer>
<script>mySlowFunction(13);</script>
</body>
</html>
`;

router.get('/with-flush', (req, res) => {
    //var startHtml = fs.readFileSync(path.join(__dirname, '/views', 'start.html'));
    //var endHtml = fs.readFileSync(path.join(__dirname, '/views', 'end.html'));

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(startHtml);
    res.write(endHtml);
    res.end();
});

router.get('/', (req, res) => {
    res.json({
        'hello': 'hi!!'
    });
})

router.get('/without-flush', (req, res) => {
    //var startHtml = fs.readFileSync('./views/start.html');
    //var endHtml = fs.readFileSync('./views/end.html');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(startHtml + endHtml);
    res.end();
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);