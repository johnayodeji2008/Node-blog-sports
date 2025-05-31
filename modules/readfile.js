const fs = require('fs');
const path = require('path');

   const data = fs.readFileSync(path.join(__dirname, '../posts/post.json'));
    const dataObj = JSON.parse(data);


    const homePage = fs.readFileSync(path.join(__dirname, '../templates/index.html'), 'utf-8');
    const postPage = fs.readFileSync(path.join(__dirname, '../templates/post_page.html'), 'utf-8');
    const cardTemp = fs.readFileSync(path.join(__dirname, '../templates/postcards.html'), 'utf-8');
    const err404 = fs.readFileSync(path.join(__dirname, '../templates/404.html'), 'utf-8');


module.exports = {homePage, postPage, cardTemp, err404, dataObj};

