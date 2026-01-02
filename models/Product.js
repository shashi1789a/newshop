const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
         type: String,
          required: true 
        },
    image: Buffer, 
    description: {
         type: String,
          required: true 
        },
    price: {
         type: Number, 
         required: true
         },
    category: {
        type: String,
        required: true,
        enum: ['fruits', 'beauty', 'medicine', 'baby-care', 'gardening', 'office']
    },
    stock: {
         type: Number,
          required: true, 
          default: 0 },
    rating: {
         type: Number,
          default: 0
         },
    reviews: [
        {
        user: { 
            type: mongoose.Schema.Types.ObjectId,
             ref: 'User' 
            },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }],
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
