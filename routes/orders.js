const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const methodOverride = require('method-override');
const authadmin = require('../middleware/authadmin');


router.use(methodOverride('_method'));

router.get('/order/:id?', auth, async (req, res) => {
  try {
    if (req.query.productid) {
  
      const product = await Product.findById(req.query.productid);
      if (!product) return res.redirect('/cart');
      return res.render('order', { product, cart: null });
    }

  
    const user = await User.findOne({ email: req.user.email }).populate('cart.product');
    res.render('order', { product: null, cart: user.cart });
  } catch (error) {
    console.error('Order Page Error:', error);
    res.redirect('/');
  }
});


router.post('/order', auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate('cart.product');

    let items = [];
    let totalAmount = 0;

    if (req.body.productid) {
     
      const product = await Product.findById(req.body.productid);
      if (!product) return res.redirect('/cart');
      const quantity = parseInt(req.body.quantity) || 1;
      items.push({ product: product._id, quantity, price: product.price });
      totalAmount = product.price * quantity;
    } else {
    
      if (!user.cart || user.cart.length === 0) return res.redirect('/cart');
      items = user.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }

    const order = new Order({
      user: user._id,
      items,
      shippingAddress: {
        name: req.body.name,
        street: req.body.street,
        locality: req.body.locality,
        zipCode: req.body.zipCode,
        phone: req.body.phone,
      },
      deliveryDate: req.body.deliveryDate,
      timeSlot: req.body.timeSlot,
      paymentMethod: req.body.paymentMethod || 'COD',
      totalAmount,
    });

    await order.save();

    if (!req.body.productid) {
      user.cart = [];
      await user.save();
    }

    res.render('payment', {
      order,
      items,
      isSingleProduct: !!req.body.productid,
    });
  } catch (error) {
    console.error('Order Placement Error:', error);
    res.redirect('/order');
  }
});


router.post('/payment/:orderId', auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.redirect('/');

    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentMethod === 'COD' ? 'pending' : 'completed';

    await order.save();

    res.redirect('/orders/my');
  } catch (error) {
    console.error('Payment Processing Error:', error);
    res.redirect(`/payment/${req.params.orderId}`);
  }
});




function adminAuth(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).send('you are not a admin');
}


// GET /orders/admin - view all orders with details (admin only)
// router.get('/adminOrders', auth, adminAuth, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('user', 'email')
//       .populate('items.product');
//     res.render('adminOrders', { orders });
//   } catch (err) {
//     console.error('Admin Orders Error:', err);
//     res.status(500).send('Server error');
//   }
// });

// // PATCH /orders/:id/status - update order (admin only)
// router.patch('/:id/status', auth, adminAuth, async (req, res) => {
//   try {
//     const { orderStatus, paymentStatus, trackingNumber } = req.body;
//     await Order.findByIdAndUpdate(req.params.id, {
//       orderStatus,
//       paymentStatus,
//       trackingNumber,
//     });
//     res.redirect('/adminOrders');
//   } catch (err) {
//     console.error('Order Update Error:', err);
//     res.status(500).send('Failed to update order');
//   }
// });

// // DELETE /orders/:id - delete order (admin only)
// router.delete('/:id', auth, adminAuth, async (req, res) => {
//   try {
//     await Order.findByIdAndDelete(req.params.id);
//     res.redirect('/adminOrders');
//   } catch (err) {
//     console.error('Order Delete Error:', err);
//     res.status(500).send('Failed to delete order');
//   }
// });

// admin routs



// GET /orders/adminOrders - view all orders (admin only)
router.get('/adminOrders',authadmin,  async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email')
      .populate('items.product');

    res.render('adminOrders', { orders });
  } catch (err) {
    console.error('Admin Orders Error:', err);
    res.status(500).send('Server error');
  }
});

// PATCH /orders/:id/status - update order status
router.patch('/:id/status',authadmin,  async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    await Order.findByIdAndUpdate(req.params.id, {
      orderStatus,
      paymentStatus,
      trackingNumber,
    });

    res.redirect('/orders/adminOrders');
  } catch (err) {
    console.error('Order Update Error:', err);
    res.status(500).send('Failed to update order');
  }
});

// DELETE /orders/:id - delete an order
router.delete('/:id',authadmin,  async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/orders/adminOrders');
  } catch (err) {
    console.error('Order Delete Error:', err);
    res.status(500).send('Failed to delete order');
  }
});
















// GET /orders/my - show logged-in user's order history
router.get('/userOrders', auth, async (req, res) => {
  try {
    // Find orders belonging to logged-in user
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 }); // recent first

    res.render('userOrders', { orders , Buffer });  // create userOrders.ejs view
  } catch (err) {
    console.error('User Orders Error:', err);
    res.status(500).send('Server error');
  }
});
module.exports = router;
