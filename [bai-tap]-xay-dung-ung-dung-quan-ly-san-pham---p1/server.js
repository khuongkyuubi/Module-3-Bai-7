const http = require('http')
const fs = require('fs')
const url = require("url")
const port = 8000;
const qs = require("qs");

let products = [];
const getLayout = () => {
    return fs.readFileSync("./views/layouts/main.html", "utf-8");
}

let server = http.createServer(function (req, res) {
    const route = url.parse(req.url, true).pathname;
    const method = req.method;
    let index = url.parse(req.url, true).query.index;
    (index instanceof Array) ? index = index[0] : index;

    // đọc dữ liệu từ file data.json
    switch (route) {
        case "/":
            if (method === "GET") {
                let html = '';
                fs.readFile('./data/data.json', 'utf8', function (err, data) {
                    products = JSON.parse(data)
                    products.forEach((product, index) => {
                        try {
                            if (product) {
                                html += '<tr>';
                                html += `<td>${index + 1}</td>`
                                html += `<td>${product["name"]}</td>`
                                html += `<td>${product["price"]}</td>`
                                html += `<td><a href="/delete?index=${index}"><button class="btn btn-danger">Delete</button></a></td>`
                                html += `<td><a href="/update?index=${index}"><button class="btn btn-primary">Update</button></a></td>`
                                html += '</tr>';
                            }
                        } catch (err) {
                            console.log(err.message);
                        }

                    });
                    fs.readFile('./views/index.html', 'utf-8', function (err, data) {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        data = data.replace('{list-user}', html);
                        let display = getLayout().replace('{content}', data)
                        res.write(display);
                        return res.end();
                    });
                });
            }
            break;
        case "/create" :
            if (method === "GET") {
                fs.readFile('./views/create.html', 'utf-8', function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    let html = "";
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    html = getLayout().replace('{content}', data);
                    res.write(html);
                    return res.end();
                });
            } else {
                let data = "";
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    let product = qs.parse(data);
                    products = fs.readFileSync('./data/data.json', 'utf-8');
                    products = JSON.parse(products);
                    product.id = products.length + 1;
                    product.price = +product.price; // convert product.price to number;
                    products = [...products, product];
                    products = JSON.stringify(products);
                    fs.writeFileSync('./data/data.json', products);
                    res.writeHead(302, {
                        location: "/"
                    });
                    return res.end();
                })

                req.on('error', () => {
                    console.log('error')
                })
            }
            break;


        case "/delete":
            if (method === "GET") {
                let html = '';
                fs.readFile('./data/data.json', 'utf8', function (err, data) {
                    products = JSON.parse(data)
                    try {
                        let product = products[index]
                        html += '<tr>';
                        html += `<td>${parseInt(index) + 1}</td>`
                        html += `<td>${product["name"]}</td>`
                        html += `<td>${product["price"]}</td>`
                        html += `<td>
                                     <form  method="POST">
                                       <button type="submit" class="btn btn-danger">Delete</button>
                                     </form>
                                 </td>`
                        html += `<td><a href="/update?index=${index}"><button class="btn btn-primary">Update</button></a></td>`
                        html += '</tr>';

                    } catch (err) {
                        html = "Load data fail!";
                        console.log(err.message);
                    }
                    fs.readFile('./views/delete.html', 'utf-8', function (err, data) {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        data = data.replace('{delete-user}', html);
                        let display = getLayout().replace('{content}', data)
                        res.write(display);
                        return res.end();
                    });
                });
            } else {
                fs.readFile('./data/data.json', 'utf8', function (err, data) {
                    products = JSON.parse(data);
                    products.splice(+index, 1);
                    products = JSON.stringify(products);
                    fs.writeFileSync('./data/data.json', products);
                    res.writeHead(302, {
                        location: "/"
                    });
                    return res.end();

                });
            }
            break;
        case "/update":
            // let index = url.parse(req.url, true).query.index;
            if (method === "GET") {

                let html = '';
                fs.readFile('./data/data.json', 'utf8', function (err, data) {
                    products = JSON.parse(data)
                    try {
                        let product = products[index];
                        fs.readFile('./views/update.html', 'utf-8', function (err, data) {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            data = data.replace(/{product-index}/gim, parseInt(index));

                            data = data.replace('{product-name}', product.name);
                            data = data.replace('{product-price}', product.price);
                            html = getLayout().replace('{content}', data);
                            res.write(html);
                            return res.end();
                        });

                    } catch (err) {
                        html = "Load data fail!";
                        console.log(err.message);
                        res.write(html);
                        return res.end();
                    }

                });
            } else {
                let data = "";
                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    let product = qs.parse(data);
                    products = fs.readFileSync('./data/data.json', 'utf-8');
                    products = JSON.parse(products);
                    product.price = +product.price; // convert product.price to number;
                    products[index] = product;
                    // products = [...products, product];
                    products = JSON.stringify(products);
                    fs.writeFileSync('./data/data.json', products);
                    res.writeHead(302, {
                        location: "/"
                    });
                    return res.end();
                })

                req.on('error', () => {
                    console.log('error')
                })
            }
            break;
        default:
            res.writeHead(404, {"Content-Type": "text/html"})
            res.write("404! Not found!")
            res.write("<br><a href='/'>Home</a>");
            res.end();
    }
})

//server listen on port
server.listen(port, function () {
    console.log('Serve running port ', port);
})

