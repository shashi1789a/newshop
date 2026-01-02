const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

dotenv.config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'yoursecretkey', 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));




mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');          
// const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const wishlistRouter = require('./routes/wishlist');
const adminAuthRoutes = require('./routes/adminAuth');
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const User = require('./models/User');
// const paymentRoutes = require('./routes/payment');


app.use('/', indexRoutes);           
app.use('/auth', authRoutes);        
// app.use('/cart', cartRoutes);       
app.use('/', orderRoutes);      
app.use('/products', productRoutes); 
// app.use('/wishlist', wishlistRoutes);
app.use('/',adminAuthRoutes);
// app.use('/', wishlistRouter);
const wishlistRoutes = require("./routes/wishlist");
app.use("/wishlist", wishlistRoutes);

// app.use('/payment', paymentRoutes);  
// await User.findOneAndUpdate({ email: 'admin@example.com' }, { role: 'admin' });

// 404 handler
// app.use((req, res) => {
//     res.status(404).render('404', { title: 'Page Not Found' });
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
