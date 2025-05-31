const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const read = require('./modules/readfile');

const routes = require('./modules/routes');

const port = process.env.PORT || 4000 

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    
    
    const pathname = parsedUrl.pathname;

     // Serve images directly from the /images folder
  if (pathname.startsWith('/images/')) {
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    };

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(read.err404);
        return;
      }

      res.writeHead(200, { 'Content-Type': mimeType[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });

    return; // stop further processing
  }

    routes(req, res);
});

server.listen(port, 'localhost', () => {
    console.log(`Listening for requests on port ${port}`)
});

