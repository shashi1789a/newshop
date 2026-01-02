const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../config/multer');

// Create new product
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            rating,
            isFeatured,
            discount
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            rating,
            isFeatured,
            discount,
            image: req.file ? req.file.buffer : undefined
        });

        await product.save();
        res.redirect('/'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating product');
    }
});

module.exports = router;
