const url = require('url');

const path = require('./readfile');
const replaceTemplate = require('./replaceTemplate');

const routeHandler = (req, res) => {

const parsedUrl = url.parse(req.url, true);

const query = parsedUrl.query;
const pathname = parsedUrl.pathname;


if(pathname === '/' || pathname === '/node-blog/sports/') {
     res.writeHead(200, {'Content-type': 'text/html'});
     const cardsHtml = path.dataObj.map(post => replaceTemplate(path.cardTemp, post)).join('');
     const output = path.homePage.replace('{%POST-LIST%}', cardsHtml); 

    res.end(output);
}else if(pathname === '/node-blog/sports/post'){
     res.writeHead(200, {'Content-type': 'text/html'});
     const post = path.dataObj.find(p => p.id === query.id);
     const output = replaceTemplate(path.postPage, post);
    res.end(output);
} else {
     res.writeHead(404, {'Content-type': 'text/html'});
     res.end(path.err404);
}
};

module.exports = routeHandler;

