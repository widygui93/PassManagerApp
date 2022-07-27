const fs = require('fs');

const mimeTypes = {
    html: 'text/html',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    js: 'application/javascript',
    css: 'text/css',
};

const renderFile = (path, response) => {
    let mime = mimeTypes[path.split('.')[2]];

    fs.readFile(path, (err, data) => {
        if (err) {
            response.statusCode = 404;
            response.write('Error: file not found');
        } else {
            response.statusCode = 200;
            response.setHeader('Content-Type', `${mime}`);
            response.write(data);
        }
        response.end();
    });
};

const storePass = (data) => {
    fs.writeFileSync('data/passwords.json', JSON.stringify(data));
};

const fetchPass = () => {
    return fs.readFileSync('data/passwords.json', 'utf-8');
};

module.exports = { renderFile, storePass, fetchPass };
