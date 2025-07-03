const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv'); 
dotenv.config();

const db = require('./controllers/db.controller.js'); // Only used for queries
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());

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
app.use('/users', userRoutes);
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
