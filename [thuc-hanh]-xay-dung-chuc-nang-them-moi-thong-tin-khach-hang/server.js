const http = require('http')
const fs = require('fs')
const qs = require('qs')
const port = 5500;
let server = http.createServer(function (req, res) {

    let methodRequest = req.method;

    if (methodRequest === 'GET') {
        fs.readFile('./templates/create.html','utf8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end()
        })
    } else {
        // xu ly submit
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            let name = qs.parse(data).name;
            // ghi dữ liệu vào file data.txt
            fs.writeFile('./data/data.txt', name, err => {
                if (err) {
                    console.log('err')
                    return;
                }
                return res.end('Create success')
            })
        })
        req.on('error', () => {
            console.log('error')
        })
    }
})

server.listen(port, function (){
    console.log('Serve running port', port)
})