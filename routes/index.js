const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();
const { auth } = require('../middleware/auth'); 


router.get('/', async function(req, res) {
  try {
    const products = await Product.find();
    res.render("index", { products });  
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});



router.get('/cart', auth, async function(req, res) {
  try {
    let user = await User.findOne({ email: req.user.email }).populate("cart");
    res.render("cart", { cart: user.cart });
  } catch (error) {
    res.redirect("/");
    console.error("Cart Error:", error);
    
  }
});

router.get("/addtocart/:productid", auth, async function(req, res) {
  try {
    let user = await User.findOne({ email: req.user.email });

    if (!Array.isArray(user.cart)) {
      user.cart = [];
    }

    const productId = req.params.productid;

    if (!user.cart.some(id => id.toString() === productId)) {
      user.cart.push(productId);
      await user.save();
    }

    res.redirect("/cart");
  } catch (error) {
     res.redirect("/");
    console.error("Add to Cart Error:", error);
   
  }
});

router.get("/removefromcart/:productid", auth, async function(req, res) {
  try {
    let user = await User.findOne({ email: req.user.email });
    user.cart = user.cart.filter(id => id.toString() !== req.params.productid);
    await user.save();
    res.redirect("/cart");
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.redirect("/cart");
  }
});
router.get("/addtocart/:productid", auth, async function(req, res) {
  try {
    let user = await User.findOne({ email: req.user.email });

    if (!Array.isArray(user.cart)) {
      user.cart = [];
    }

    const productId = req.params.productid;

    if (!user.cart.some(id => id.toString() === productId)) {
      user.cart.push(productId);
      await user.save();
    }

    res.redirect("/cart");
  } catch (error) {
     res.redirect("/");
    console.error("Add to Cart Error:", error);
   
  }
});

router.get('/Details', (req, res) => {
  res.render('Details'); 
});
router.get('/priceCal', (req, res) => {
  res.render('priceCal'); 
});

router.get('/contact', (req, res) => {
  res.render('contact'); 
});

router.get('/contactconfirm', (req, res) => {
  res.render('contactconfirm'); 
});


router.get('/medicine', async (req, res) => {
  try {
    const products = await Product.find({ category: 'medicine' }); 
    res.render('Medicine', { products });
  } catch (error) {
    console.error("Medicine Page Error:", error);
    res.redirect('/');
  }
});

router.get('/Baby', async (req, res) => {
  try {
    const products = await Product.find({ category: 'baby-care' }); 
    res.render('Baby', { products });
  } catch (error) {
    console.error("baby-care Page Error:", error);
    res.redirect('/');
  }
});
router.get('/Officecat', async (req, res) => {
  try {
    const products = await Product.find({ category: 'office' }); 
    res.render('Officecat', { products });
  } catch (error) {
    console.error("Officecat Page Error:", error);
    res.redirect('/');
  }
});
router.get('/Beauty', async (req, res) => {
  try {
    const products = await Product.find({ category: 'beauty' }); 
    res.render('Beauty', { products });
  } catch (error) {
    console.error("Beauty Page Error:", error);
    res.redirect('/');
  }
});
router.get('/gardening', async (req, res) => {
  try {
    const products = await Product.find({ category: 'gardening' }); 
    res.render('gardening', { products });
  } catch (error) {
    console.error("gardening Page Error:", error);
    res.redirect('/');
  }
});

router.get('/fruits', async (req, res) => {
  try {
    const products = await Product.find({ category: 'fruits' }); 
    res.render('fruits', { products });
  } catch (error) {
    console.error("/fruits Page Error:", error);
    res.redirect('/');
  }
});



router.get('/payment', (req, res) => {
  res.render('payment'); 
});

router.get('/paymentconf', (req, res) => {
  res.render('paymentconf'); 
});

router.get('/Myorder', (req, res) => {
  res.render('Myorder'); 
});

router.get('/profile', (req, res) => {
  res.render('profile'); 
});

router.get('/whislist', (req, res) => {
  res.render('whislist'); 
});

router.get('/Best', (req, res) => {
  res.render('Best'); 
});

router.get('/', (req, res) => {
  res.render('contactconfirm'); 
});



router.get('/cart', (req, res) => {
  res.render('cart'); 
});


router.get('/aboutus', (req, res) => {
  res.render('aboutus'); 
});


router.get('/feedback', (req, res) => {
  res.render('feedback'); 
});

router.get('/feedbackconfirm', (req, res) => {
  res.render('feedbackconfirm'); 
});


router.post('/contact', (req, res) => {

  res.render('contact-success');
});



// router.get("/admin", function(req,res){
//   res.render("createproduct")
// })


router.get('/shop', async function(req, res) {
  try {
    const products = await Product.find();
    res.render("shop", { products });  
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.get('/create-product', (req, res) => {
  res.render('createProduct');
});





module.exports = router;






























