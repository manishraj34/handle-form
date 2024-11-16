const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log("Database connected");

    db = client.db('Mern');
    collection = db.collection('product');
}

main();

// Route to render the show page (product list)
app.get("/", async (req, res) => {
    try {
        // Fetch products from the database
        const products = await db.collection('product').find().toArray();
        res.render('pages/show', { products });
    } catch (err) {
        console.error('Error retrieving products:', err);
        res.status(500).send('Error retrieving products');
    }
});

// Route to render the add-product page
app.get('/add-product', (req, res) => {
    res.render('pages/add-product');
});

// Route to handle form submission for adding product
app.post('/add-product', async (req, res) => {
    const { p_Id, p_name, category, price, stock } = req.body;

    try {
        // Insert the new product into the MongoDB collection
        await db.collection('product').insertOne({
            p_Id,
            p_name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock)
        });

        // Fetch all products after adding the new one
        const products = await db.collection('product').find().toArray();

        // Render the show.ejs page with updated product list
        res.render('pages/show', { products });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
