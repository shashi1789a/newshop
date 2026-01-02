const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const wishlistProducts = await Product.find({ _id: { $in: user.wishlist } });
    res.render('wishlist/whislist', { wishlist: wishlistProducts });
  } catch (error) {
    console.error('Wishlist Error:', error);
    res.redirect('/');
  }
});


router.get('/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.redirect('/wishlist');
  } catch (error) {
    console.error(error);
    res.redirect('/wishlist');
  }
});

// Move to cart
router.get('/move-to-cart/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

   
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);

  
    const existingCartItem = user.cart.items.find(
      item => item.product.toString() === req.params.productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.items.push({ product: req.params.productId, quantity: 1 });
    }

    await user.save();
    res.redirect('/wishlist');
  } catch (error) {
    console.error(error);
    res.redirect('/wishlist');
  }
});

module.exports = router;
