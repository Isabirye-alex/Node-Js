const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv'); 
const app = express();
const port = 3000;
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URL;
mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Db opened successfully"));

// Routes
const categoryRoutes = require('./routes/category.routes');
const subCategoryRoutes = require('./routes/subCategory.routes.js');
const productRoutes = require('./routes/product.routes.js');
const brandRoutes = require('./routes/brand.routes.js');
const adminRoutes = require('./routes/admin.routes.js');
const reviewRoutes = require('./routes/review.routes.js');
const couponRoutes = require('./routes/coupon.routes.js');
const notificationRoutes = require('./routes/notification.routes.js');
const paymentRoutes = require('./routes/payment.routes.js');
const userRoutes = require('./routes/user.routes.js');
const cartRoutes = require('./routes/cart.routes.js');
const orderRoutes = require('./routes/order.routes.js');
app.use('/categories', categoryRoutes);
app.use('/subcategories', subCategoryRoutes);
app.use('/products', productRoutes);
app.use('/brands', brandRoutes);
app.use('/coupons', couponRoutes);
app.use('/admin', adminRoutes);
app.use('/review', reviewRoutes);
app.use('/notifications', notificationRoutes);
app.use('/payments', paymentRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);



// Test root
app.get("/", (req, res) => {
  res.json("App is working Wonderfully");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
