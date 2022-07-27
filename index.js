const http = require('http');
const { renderFile, storePass, fetchPass } = require('./utils/pass-man');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((request, response) => {
    let uri = request.url;

    switch (uri) {
        case '/add':
            let data;

            request.on('data', (chunk) => {
                data = chunk.toString();
            });
            request.on('end', () => {
                data = JSON.parse(data);

                try {
                    storePass(data);
                    response.setHeader('typeAlert', 'alert-success');
                    response.setHeader('note', 'store password successfully');
                    response.end();
                } catch (err) {
                    response.setHeader('typeAlert', 'alert-danger');
                    response.setHeader('note', 'store password goes wrong');
                    response.end();
                }
            });

            break;
        case '/view':
            renderFile('./views/list.html', response);
            break;
        case '/list':
            try {
                const listPass = fetchPass();
                response.write(listPass);
                response.end();
            } catch (err) {
                response.writeHead(404);
                response.write('Error: file not found');
                response.end();
            }

            break;
        default:
            let path = uri == '/' ? './views/index.html' : `.${uri}`;
            renderFile(path, response);
            break;
    }
});

server.listen(port, hostname, () => {
    console.info(`server standby at http://${hostname}:${port}`);
});
