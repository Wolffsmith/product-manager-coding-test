const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is Listening on PORT:", PORT);
});

let mockDb = [
    { id: 1, name: 'Fries', available: true },
    { id: 2, name: 'Big Mac', available: true },
    { id: 3, name: 'Drink', available: false },
    { id: 4, name: '6 pc. McNuggets', available: true },
    { id: 5, name: '12 pc. McNuggets', available: false },
    { id: 6, name: '(New) Cheeseburger', available: false },
    { id: 7, name: 'Sundae', available: true },
];

app.get('/products', (req, res) => {
    let filteredProducts = mockDb;

    if (req.query.available) {
        const available = req.query.available === 'true';
        filteredProducts = filteredProducts.filter(product => product.available === available);
    }

    const sortBy = req.query.sortBy || 'id';
    filteredProducts = filteredProducts.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });

    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        filteredProducts = filteredProducts.filter(product => searchRegex.test(product.name));
    }

    res.json(filteredProducts);
});

app.post('/products', (req, res) => {
    const newProduct = {
        id: mockDb.length + 1,
        name: req.body.name,
        available: req.body.available || true
    };
    mockDb.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mockDb.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name !== undefined ? req.body.name : product.name;
    product.available = req.body.available !== undefined ? req.body.available : product.available;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    mockDb = mockDb.filter(p => p.id !== productId);
    res.status(204).send();
});
