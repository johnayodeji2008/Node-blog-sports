const url = require('url');
const path = require('./readfile');
const replaceTemplate = require('./replaceTemplate');
const fs = require('fs');
const querystring = require('querystring');
const axios = require('axios');

const injectMessage = (html, message) => {
  const safe = message ? `<p style="color:red;">${message}</p>` : '';
  return html.replace('<!-- MESSAGE_PLACEHOLDER -->', safe);
};

const routeHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // BLOG ROUTES
  if ((pathname === '/' || pathname === '/node-blog/sports/') && method === 'GET') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = path.dataObj.map(post => replaceTemplate(path.cardTemp, post)).join('');
    const output = path.homePage.replace('{%POST-LIST%}', cardsHtml);
    return res.end(output);
  }

  if (pathname === '/node-blog/sports/post' && method === 'GET') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const post = path.dataObj.find(p => p.id === query.id);
    const output = replaceTemplate(path.postPage, post);
    return res.end(output);
  }

  // LOGIN PAGE (GET)
  if (pathname === '/login' && method === 'GET') {
    fs.readFile('./templates/login.html', 'utf-8', (err, html) => {
      const error = query.error || '';
      const finalHtml = injectMessage(html, error);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(finalHtml);
    });
    return;
  }

  // REGISTER PAGE (GET)
  if (pathname === '/register' && method === 'GET') {
    fs.readFile('./templates/register.html', 'utf-8', (err, html) => {
      const error = query.error || '';
      const finalHtml = injectMessage(html, error);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(finalHtml);
    });
    return;
  }

  // LOGIN (POST)
  if (pathname === '/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      const { email, password } = querystring.parse(body);
      try {
        const response = await axios.post('https://auth-sim-api.onrender.com/login', {
          email,
          password
        });

        if (response.status === 200) {
          res.writeHead(302, { Location: '/' });
        } else {
          const msg = response.data?.message || 'Login failed';
          res.writeHead(302, { Location: `/login?error=${encodeURIComponent(msg)}` });
        }
        res.end();
      } catch (err) {
        const msg = err.response?.data?.message || 'Login error';
        res.writeHead(302, { Location: `/login?error=${encodeURIComponent(msg)}` });
        res.end();
      }
    });
    return;
  }

  // REGISTER (POST)
  if (pathname === '/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      const { fullname, email, password } = querystring.parse(body);
      try {
        const response = await axios.post('https://auth-sim-api.onrender.com/register', {
          fullname,
          email,
          password
        });

        if (response.status === 200) {
          res.writeHead(302, { Location: '/login' });
        } else {
          const msg = response.data?.message || 'Registration failed';
          res.writeHead(302, { Location: `/register?error=${encodeURIComponent(msg)}` });
        }
        res.end();
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration error';
        res.writeHead(302, { Location: `/register?error=${encodeURIComponent(msg)}` });
        res.end();
      }
    });
    return;
  }

  // 404 fallback
  res.writeHead(404, { 'Content-type': 'text/html' });
  res.end(path.err404);
};

module.exports = routeHandler;
