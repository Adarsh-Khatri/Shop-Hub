let express = require("express");
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT || 2410;

let app = express();
app.use(express.json());
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD");
    res.header("Access-Control-Allo-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.listen(PORT, () => console.log(`Listening on port http://localhost/${PORT}`))

let { data: shopData } = require('./data.js');
let fs = require('fs');
let fileName = 'data.json';


app.get('/api/resetData', (req, res) => {
    let data = JSON.stringify(shopData);
    fs.writeFile(fileName, data, (err) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else res.send('DATA IN FILE IS RESET');
    })
})



// -------------------------------------------------------------- SHOPS API



// @ GET
// @ ROUTE /shops
app.get('/shops', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else {
            let shopsObj = JSON.parse(data)
            res.send(shopsObj.shops)
        };
    })
})



// @ POST
// @ ROUTE /shops
app.post('/shops', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send(`ERROR: ${err}`);
        } else {
            let parsedData = JSON.parse(data);
            let { shops } = parsedData;
            let maxId = shops.reduce((acc, cur) => (cur.shopId > acc ? cur.shopId : acc), 0);
            let newId = maxId + 1;
            let newShop = { shopId: newId, ...req.body };
            shops.push(newShop);
            parsedData.shops = shops;
            let newData = JSON.stringify(parsedData);
            fs.writeFile(fileName, newData, (err) => {
                if (err) {
                    res.status(404).send(`ERROR: ${err}`);
                } else {
                    res.send(newShop);
                }
            });
        }
    });
});



// -------------------------------------------------------------- PRODUCTS API



// @ GET
// @ ROUTE /products/:id/edit
app.get('/products/:id/edit', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else {
            let parsedData = JSON.parse(data)
            let { products } = parsedData;
            let result = products.find(prod => prod.productId === (+id))
            console.log(result);
            res.send(result)
        };
    })
})



// @ GET
// @ ROUTE /products
app.get('/products', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else {
            let parsedData = JSON.parse(data)
            let { products } = parsedData;
            res.send(products)
        };
    })
})



// @ POST
// @ ROUTE /products
app.post('/products', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send(`ERROR: ${err}`);
        } else {
            let parsedData = JSON.parse(data);
            let { products } = parsedData;
            let maxId = products.reduce((acc, cur) => (cur.productId > acc ? cur.productId : acc), 0);
            let newId = +maxId + 1;
            console.log(newId);
            let newShop = { ...req.body, productId: newId };
            products.push(newShop);
            parsedData.products = products;
            let newData = JSON.stringify(parsedData);
            fs.writeFile(fileName, newData, (err) => {
                if (err) {
                    res.status(404).send(`ERROR: ${err}`);
                } else {
                    res.send(newShop);
                }
            });
        }
    });
});



// @ PUT
// @ ROUTE /products/:id
app.put('/products/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(err)
        else {
            let parsedData = JSON.parse(data);
            let { products } = parsedData;
            let index = products.findIndex(prod => prod.productId === (+id))
            console.log(index);
            if (index >= 0) {
                let updatedProduct = { ...products[index], ...req.body }
                products[index] = updatedProduct;
                parsedData.products = products;
                let data1 = JSON.stringify(parsedData)
                fs.writeFile(fileName, data1, (err) => {
                    if (err) res.status(404).send(err)
                    else res.send(updatedProduct);
                })
            }
            else res.status(404).send("NO PRODUCT FOUND")
        }
    })
})




// -------------------------------------------------------------- PURCHASES API



// @ GET
// @ ROUTE /purchases/shops/:id
app.get('/purchases/shops/:id', (req, res) => {
    let { id } = req.params;
    console.log(id);
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else {
            let parsedData = JSON.parse(data)
            let { purchases } = parsedData;
            let result = purchases.filter(pur => pur.shopId === (+id))
            console.log('RESULT : ', result);
            res.send(result)
        };
    })
})


// @ GET
// @ ROUTE /purchases/products/:id
app.get('/purchases/products/:id', (req, res) => {
    let { id } = req.params;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else {
            let parsedData = JSON.parse(data)
            let { purchases } = parsedData;
            let result = purchases.filter(pur => pur.productid === (+id))
            res.send(result)
        };
    })
})


// @ GET
// @ ROUTE /purchases AND PARAMS {shop, product, sort}
app.get('/purchases', (req, res) => {
    let { shop, product, sort } = req.query;
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR : `, err)
        else {
            let parsedData = JSON.parse(data)
            let { purchases } = parsedData;
            if (shop) {
                purchases = purchases.filter(pur => pur.shopId === (+shop.substring(2)))
            }
            if (product) {
                let productArr = product.split(',');
                purchases = purchases.filter(purchase => productArr.find(prod => +(prod.substring(2)) === purchase.productid))
                console.log('PURCHASES: ', purchases);
            }
            if (sort == 'QtyAsc') {
                purchases.sort((a, b) => a.quantity - b.quantity)
            } else if (sort == 'QtyDesc') {
                purchases.sort((a, b) => b.quantity - a.quantity)
            } else if (sort == 'ValueAsc') {
                purchases.sort((a, b) => a.quantity * a.price - b.quantity * b.price)
            } else if (sort == 'ValueDesc') {
                purchases.sort((a, b) => b.quantity * b.price - a.quantity * a.price)
            }
            res.send(purchases)
        };
    })
})



// @ POST
// @ ROUTE /purchases
app.post('/purchases', (req, res) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            res.status(404).send(`ERROR: ${err}`);
        } else {
            let parsedData = JSON.parse(data);
            let { purchases } = parsedData;
            let maxId = purchases.reduce((acc, cur) => (cur.purchaseId > acc ? cur.purchaseId : acc), 0);
            let newId = maxId + 1;
            let newShop = { purchaseId: newId, ...req.body };
            purchases.push(newShop);
            parsedData.purchases = purchases;
            let newData = JSON.stringify(parsedData);
            fs.writeFile(fileName, newData, (err) => {
                if (err) {
                    res.status(404).send(`ERROR: ${err}`);
                } else {
                    res.send(newShop);
                }
            });
        }
    });
});



// @ GET
// @ ROUTE /totalPurchase/product/:id
app.get('/totalPurchase/product/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR: ${err}`);
        else {
            const { purchases } = JSON.parse(data);
            const totalPurchase = purchases.filter(purchase => purchase.productid === (+id))
                .reduce((result, purchase) => {
                    let resObj = result.find(res => res.shopId == purchase.shopId)
                    if (resObj) {
                        resObj.totalProductPurchase += purchase.quantity * purchase.price;
                    } else {
                        let tempObj = {};
                        if (!tempObj.shopId) {
                            tempObj.shopId = purchase.shopId
                            tempObj.totalProductPurchase = purchase.quantity * purchase.price;
                        }
                        result.push(tempObj);
                    }
                    return result;
                }, []);
            totalPurchase.sort((a, b) => a.shopId - b.shopId)
            res.send(totalPurchase);
        }
    });
});



// @ GET
// @ ROUTE /totalPurchase/shop/:id
app.get('/totalPurchase/shop/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) res.status(404).send(`ERROR: ${err}`);
        else {
            const { purchases } = JSON.parse(data);
            const totalPurchase = purchases.filter(purchase => purchase.shopId === (+id))
                .reduce((result, purchase) => {
                    let resObj = result.find(res => res.productid == purchase.productid)
                    if (resObj) {
                        resObj.totalShopPurchase += purchase.quantity * purchase.price;
                    } else {
                        let tempObj = {};
                        if (!tempObj.productid) {
                            tempObj.productid = purchase.productid
                            tempObj.totalShopPurchase = purchase.quantity * purchase.price;
                        }
                        result.push(tempObj);
                    }
                    return result;
                }, []);
            totalPurchase.sort((a, b) => a.productid - b.productid)
            res.send(totalPurchase);
        }
    });
});

