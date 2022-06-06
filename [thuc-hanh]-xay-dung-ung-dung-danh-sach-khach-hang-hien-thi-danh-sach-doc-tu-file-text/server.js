const http = require('http')
const fs = require('fs')
const port = 8000;

let server = http.createServer(function (req, res) {
    // đọc dữ liệu từ file data.txt
    let dataFile = '';
    let html = '';
    fs.readFile('./data/data.txt', 'utf8', function (err, str) {
        dataFile = str.split(",")
        dataFile.forEach((value, index) => {
            html += '<tr>';
            html += `<td>${index + 1}</td>`
            html += `<td>${value}</td>`
            html += `<td><button class="btn btn-danger">Delete</button></td>`
            html += '</tr>';
        });
    });

    fs.readFile('./templates/index.html', 'utf8', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        data = data.replace('{list-user}', html)
        res.write(data)
        res.end()
    });
})

server.listen(port, function () {
    console.log('Serve running port ', port);
})