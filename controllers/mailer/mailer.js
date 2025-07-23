
// const express = require('express');
// const nodemailer = require('nodemailer');
// const hbs = require('nodemailer-express-handlebars');
// const path = require('path');

// const app = express();
// app.use(express.json());

// // Configure transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your_email@gmail.com',
//     pass: 'your_app_password', // Use App Password for Gmail
//   },
// });

// // Configure Handlebars
// transporter.use('compile', hbs({
//   viewEngine: {
//     extname: '.handlebars',
//     layoutsDir: '',
//     defaultLayout: false,
//   },
//   viewPath: path.resolve('./templates'),
//   extName: '.handlebars',
// }));

// // POST endpoint to send email
// app.post('/send-email', async (req, res) => {
//   const { name, email } = req.body;

//   try {
//     await transporter.sendMail({
//       from: '"GoShop" <your_email@gmail.com>',
//       to: email,
//       subject: 'Welcome to GoShop!',
//       template: 'email', // same as "email.handlebars"
//       context: {
//         name,
//         verifyLink: `https://yourapp.com/verify?email=${encodeURIComponent(email)}`,
//       },
//     });

//     res.send({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     res.status(500).send({ success: false, message: error.toString() });
//   }
// });

// // Start server
// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
