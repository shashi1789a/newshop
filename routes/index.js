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































// cart 

// router.get('/addtocart/:productId', async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).send('Product not found');
//     }

//     // Initialize cart in session if not present
//     if (!req.session.cart) {
//       req.session.cart = [];
//     }

//     // Check if product already in cart
//     const cartItemIndex = req.session.cart.findIndex(item => item.product._id.toString() === productId);

//     if (cartItemIndex > -1) {
//       // If product exists in cart, increase quantity
//       req.session.cart[cartItemIndex].quantity += 1;
//     } else {
//       // Else add new product with quantity 1
//       req.session.cart.push({ product: product.toObject(), quantity: 1 });
//     }

//     // Save session and redirect to cart page
//     req.session.save(err => {
//       if (err) {
//         console.error('Session save error:', err);
//       }
//       res.redirect('/cart');
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });
// router.get('/cart', (req, res) => {
//   const cart = req.session.cart || [];
//   res.render('cart', { cart });
// });

// router.get("/removefromcart/:productid", auth, async function (req, res) {
//   try {
//     const user = await User.findOne({ email: req.user.email });

//     // Ensure cart is an array
//     if (!Array.isArray(user.cart)) {
//       console.log("Fixing user.cart: Not an array");
//       user.cart = [];
//     }

//     // Filter properly based on product ID
//     user.cart = user.cart.filter(item => {
//       if (!item.product) return true;
//       return item.product.toString() !== req.params.productid;
//     });

//     await user.save();
//     res.redirect("/cart");
//   } catch (error) {
//     console.error("Error removing item from cart:", error);
//     res.redirect("/cart");
//   }
// });






// router.get('/cart/:productId', async (req, res) => {
//   // Your cart handling logic here...
//   let cart = [];

//   if (req.user) {
//     await req.user.populate('cart.items.product');
//     cart = req.user.cart.items.map(item => ({
//       _id: item.product._id,
//       name: item.product.name,
//       price: item.product.price,
//       image: item.product.image,
//       quantity: item.quantity
//     }));
//   } else if (req.session.cart) {
//     cart = req.session.cart;
//   }

//   res.render('cart', { cart });
// });


// router.get('/cart', async (req, res) => {
//   let cart = [];

//   if (req.user && req.user.cart) {
//     // If user is logged in, use user's cart
//     cart = await Promise.all(
//       req.user.cart.items.map(async item => {
//         const product = await Product.findById(item.product);
//         return {
//           ...product.toObject(),
//           quantity: item.quantity,
//         };
//       })
//     );
//   } else if (req.session.cart) {
//     // If user not logged in, use session cart
//     cart = req.session.cart;
//   }

//   res.render('cart', { cart });
// });


// router.get('/cart', auth, async function(req, res) {
//     let user = await User
//     .findOne({ email: req.user.email })
//     .populate("cart");

//     console.log(user.cart);
//     res.render("cart", {user});
// });


// // remove from cart 
// router.get("/removefromcart/:productid", auth, async function(req,res){
//   try {
//     let user = await User.findOne({ email: req.user.email });

//     user.cart = user.cart.filter(id => id.toString() != req.params.productid);

//     await user.save();
//     res.redirect("/cart")
//   } catch (error) {
//     console.error("error ", error)
//     res.redirect("/cart");
    
//   }
// });

// //add to cart

// router.get("/addtocart/:productid",auth, async function(req,res){
//   let user = await User.findOne({email: req.user.email});
//   user.cart.push(req.params.productid);
//   await user.save();
//   res.redirect("/")
// })




// router.get('/cart', auth, async function(req, res) {
//   try {
//     let user = await User.findOne({ email: req.user.email }).populate("cart");
//     res.render("cart", { user });
//   } catch (error) {
//     console.error("Cart Error:", error);
//     res.redirect("cart");
//   }
// });

// router.get("/addtocart/:productid", auth, async function(req, res) {
//   try {
//     let user = await User.findOne({ email: req.user.email });
//     user.cart.push(req.params.productid);
//     await user.save();
//     res.redirect("/");
//   } catch (error) {
//     console.error("Add to Cart Error:", error);
//     res.redirect("/");
//   }
// });

// router.get("/removefromcart/:productid", auth, async function(req, res) {
//   try {
//     let user = await User.findOne({ email: req.user.email });
//     user.cart = user.cart.filter(id => id.toString() !== req.params.productid);
//     await user.save();
//     res.redirect("/cart");
//   } catch (error) {
//     console.error("Remove from Cart Error:", error);
//     res.redirect("/cart");
//   }
// });