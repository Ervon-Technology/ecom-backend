const Collection = require('../models/collection');
const Product = require('../models/product'); // Assuming you have a Product model

exports.createCollection = async (req, res) => {
    try {
        const { name, description, productIds } = req.body;

        const products = await Product.find({ _id: { $in: productIds } });

        const newCollection = new Collection({
            name,
            description,
            products
        });

        await newCollection.save();

        res.status(201).json({ message: 'Collection created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create collection' });
    }
};

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.find().populate('products');
        res.json(collections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
};