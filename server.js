let express = require("express");
let mysql = require('mysql');
require('dotenv').config();
let cors = require('cors');
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


const { Client } = require("pg")
const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    ssl: { rejectUnauthorized: false }
});
client.connect((err) => {
    if (err) console.error('Error connecting to the database:', err);
    else console.log('CONNECTED SECURELY');
});


// -------------------------------------------------------------- SHOPS API



// @ GET
// @ ROUTE /shops
app.get('/shops', (req, res) => {
    const sql = "SELECT * FROM SHOPS";
    client.query(sql, (err, result) => {
        if (err) res.status(400).json(`SHOPS ERROR : ${err.message}`);
        else {
            return res.status(200).json(result.rows)
        }
    })
})



// @ POST
// @ ROUTE /shops
app.post('/shops', (req, res) => {
    let body = req.body;
    let maxSql = `SELECT MAX(shopid) AS max FROM SHOPS`;
    client.query(maxSql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            let id = data.rows[0].max ? +(data.rows[0].max) + 1 : 1;
            let sql = `INSERT INTO SHOPS(shopid, name, rent) VALUES($1, $2, $3)`;
            client.query(sql, [id, body.name, body.rent], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                } else {
                    return res.status(200).json(body);
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
    const sql = "SELECT * FROM PRODUCTS WHERE productid = $1";
    client.query(sql, [id], (err, result) => {
        if (err) res.status(400).json(`PRODUCTS ERROR : ${err.message}`);
        else {
            return res.status(200).json(result.rows)
        }
    })
})



// @ GET
// @ ROUTE /products
app.get('/products', (req, res) => {
    const sql = "SELECT * FROM PRODUCTS";
    client.query(sql, (err, result) => {
        if (err) res.status(400).json(`PRODUCTS ERROR : ${err.message}`);
        else {
            return res.status(200).json(result.rows)
        }
    })
})



// @ POST
// @ ROUTE /products
app.post('/products', (req, res) => {
    let body = req.body;
    let maxSql = `SELECT MAX(productid) AS max FROM PRODUCTS`;
    client.query(maxSql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            let id = data.rows[0].max ? +(data.rows[0].max) + 1 : 1;

            let sql = `INSERT INTO PRODUCTS(productid, productname, category, description) VALUES($1, $2, $3, $4)`;
            client.query(sql, [id, body.productname, body.category, body.description], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                } else {
                    return res.status(200).json(body);
                }
            });
        }
    });
});



// @ PUT
// @ ROUTE /products/:id
app.put('/products/:id', (req, res) => {
    let { id } = req.params;
    let body = req.body;
    let sql = `UPDATE PRODUCTS SET productid = $1, productname = $2, category = $3, description = $4 WHERE productid = $5`;
    client.query(sql, [body.productid, body.productname, body.category, body.description, id], (err) => {
        if (err) return res.status(404).json({ error: err.message });
        else return res.status(200).json(body);
    });
})





// -------------------------------------------------------------- PURCHASES API




// @ GET
// @ ROUTE /purchases/shops/:id
app.get('/purchases/shops/:id', (req, res) => {
    let { id } = req.params;
    const sql = "SELECT * FROM PURCHASES WHERE shopid = $1";
    client.query(sql, [id], (err, result) => {
        if (err) res.status(400).json(`PURCHASES ERROR : ${err.message}`);
        else {
            return res.status(200).json(result.rows)
        }
    })
})


// @ GET
// @ ROUTE /purchases/products/:id
app.get('/purchases/products/:id', (req, res) => {
    let { id } = req.params;
    const sql = "SELECT * FROM PURCHASES WHERE productid = $1";
    client.query(sql, [id], (err, result) => {
        if (err) res.status(400).json(`PURCHASES ERROR : ${err.message}`);
        else {
            return res.status(200).json(result.rows)
        }
    })
})


// @ GET
// @ ROUTE /purchases AND PARAMS {shop, product, sort}
app.get('/purchases', (req, res) => {
    let { shop, product, sort } = req.query;
    const sql = "SELECT * FROM PURCHASES";
    client.query(sql, (err, result) => {
        if (err) res.status(400).json(`ERROR : ${err.message}`);
        else {
            let data = result.rows;
            let productArr = product && product.split(',');
            data = productArr ? data.filter(dt => productArr.findIndex(prod => +(prod.substring(2)) == dt.productid) >= 0) : data;
            data = shop ? data.filter(dt => dt.shopid == (+shop.substring(2))) : data;
            if (sort == 'QtyAsc') {
                data.sort((a, b) => a.quantity - b.quantity)
            } else if (sort == 'QtyDesc') {
                data.sort((a, b) => b.quantity - a.quantity)
            } else if (sort == 'ValueAsc') {
                data.sort((a, b) => a.quantity * a.price - b.quantity * b.price)
            } else if (sort == 'ValueDesc') {
                data.sort((a, b) => b.quantity * b.price - a.quantity * a.price)
            }
            return res.status(200).json(data)
        }
    })
})



// @ POST
// @ ROUTE /purchases
app.post('/purchases', (req, res) => {
    let body = req.body;
    let maxSql = `SELECT MAX(purchaseid) AS max FROM PURCHASES`;
    client.query(maxSql, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            let id = data.rows[0].max ? +(data.rows[0].max) + 1 : 1;
            let sql = `INSERT INTO PURCHASES(purchaseid, shopid, productid, quantity, price) VALUES($1, $2, $3, $4, $5)`;
            client.query(sql, [id, body.shopid, body.productid, body.quantity, body.price], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                } else {
                    return res.status(200).json(body);
                }
            });
        }
    });
});



// @ GET
// @ ROUTE /totalPurchase/product/:id
app.get('/totalPurchase/product/:id', (req, res) => {
    let { id } = req.params;
    const sql = "SELECT * FROM PURCHASES WHERE productid = $1";
    client.query(sql, [id], (err, result) => {
        if (err) res.status(400).json(`PURCHASES ERROR : ${err.message}`);
        else {
            let data = result.rows;
            let totalPurchase = data.reduce((result, purchase) => {
                let resObj = result.find(res => res.shopid == purchase.shopid)
                if (resObj) {
                    resObj.totalProductPurchase += purchase.quantity * purchase.price;
                } else {
                    let tempObj = {};
                    if (!tempObj.shopid) {
                        tempObj.shopid = purchase.shopid
                        tempObj.totalProductPurchase = purchase.quantity * purchase.price;
                    }
                    result.push(tempObj);
                }
                return result;
            }, []);
            totalPurchase.sort((a, b) => a.shopid - b.shopid)
            return res.status(200).json(totalPurchase)
        }
    })
});


// @ GET
// @ ROUTE /totalPurchase/shop/:id
app.get('/totalPurchase/shop/:id', (req, res) => {
    let { id } = req.params;
    const sql = "SELECT * FROM PURCHASES WHERE shopid = $1";
    client.query(sql, [id], (err, result) => {
        if (err) res.status(400).json(`PURCHASES ERROR : ${err.message}`);
        else {
            let data = result.rows;
            let totalPurchase = data.reduce((result, purchase) => {
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
            return res.status(200).json(totalPurchase)
        }
    })
});






// ---------------------------------------------------------------- FOR RESETING THE DATA



let { shops, products, purchases } = require('./data.js')


// @ GET
// @ ROUTE : /shops/resetData
app.get('/shops/resetData', (req, res) => {
    let sql = `DELETE FROM SHOPS`;
    client.query(sql, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Shops Error Resetting Data' });
        }
        let shopArr = shops.map(shop => [shop.shopid, shop.name, shop.rent]);
        let placeholders = shopArr.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ');
        let sql2 = `INSERT INTO SHOPS(shopid, name, rent) VALUES ${placeholders}`;
        client.query(sql2, shopArr.flat(), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Shops Error Resetting Data' });
            }
            return res.status(200).json({ message: "SHOPS DATA RESET SUCCESSFULLY" });
        });
    });
})


// @ GET
// @ ROUTE : /products/resetData
app.get('/products/resetData', (req, res) => {
    let sql = `DELETE FROM PRODUCTS`;
    client.query(sql, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Products Error Resetting Data' });
        }
        let productArr = products.map(product => [product.productid, product.productname, product.category, product.description]);
        let placeholders = productArr.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ');
        let sql2 = `INSERT INTO PRODUCTS(productid, productname, category, description) VALUES ${placeholders}`;
        client.query(sql2, productArr.flat(), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Products Error Resetting Data' });
            }
            return res.status(200).json({ message: "PRODUCTS DATA RESET SUCCESSFULLY" });
        });
    });
})


// @ GET
// @ ROUTE : /purchases/resetData
app.get('/purchases/resetData', (req, res) => {
    let sql = `DELETE FROM PURCHASES`;
    client.query(sql, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Purchases Error Resetting Data' });
        }
        let purchasesArr = purchases.map(purchase => [purchase.purchaseid, purchase.shopid, purchase.productid, purchase.quantity, purchase.price]);
        let placeholders = purchasesArr.map((_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`).join(', ');
        let sql2 = `INSERT INTO PURCHASES(purchaseid, shopid, productid, quantity, price) VALUES ${placeholders}`;
        client.query(sql2, purchasesArr.flat(), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Purchases Error Resetting Data' });
            }
            return res.status(200).json({ message: "PURCHASES DATA RESET SUCCESSFULLY" });
        });
    });
})
