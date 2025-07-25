const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

async function sendWelcomeEmail(req, res) {
  try {
    const supportEmail = "isabiryealexx@gmail.com";
    const company = "XShop";
    const website = ""; 

    const { receiver, receiverName } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mk5143195@gmail.com",
        pass: "xnmvmpivkvjtmidp", 
      },
    });

    // Configure handlebars with correct paths
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          defaultLayout: false,
          partialsDir: path.resolve("./views/"),
        },
        viewPath: path.resolve("./views/"),
        extName: ".hbs",
      })
    );

    const mailOptions = {
      from: `"${company}" <mk5143195@gmail.com>`,
      to: receiver,
      subject: "Account Activated ✅ Ready to Explore",
      template: "welcome", 
      context: {
        receiverName,
        company,
        supportEmail,
        website,
        year: new Date().getFullYear(),
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ success: true, message: "Email sent successfully"});
      }
    });
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
}

async function sendOrderEmail(req, res) {
  try {
    const supportEmail = "isabiryealexx@gmail.com";
    const company = "XShop";
    const website = "https://xshop.com"; // Your live URL

    const {
      receiver,
      receiverName,
      orderId,
      orderDate,
      paymentMethod,
      shippingAddress,
      orderItems,
      total
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mk5143195@gmail.com",
        pass: "xnmvmpivkvjtmidp",
      },
    });

    transporter.use("compile", hbs({
      viewEngine: {
        extname: ".hbs",
        defaultLayout: false,
        partialsDir: path.resolve("./views/"),
      },
      viewPath: path.resolve("./views/"),
      extName: ".hbs",
    }));

    const mailOptions = {
      from: `"${company}" <mk5143195@gmail.com>`,
      to: receiver,
      subject: `Order Received – ${company}`,
      template: "order",
      context: {
        receiverName,
        company,
        supportEmail,
        website,
        year: new Date().getFullYear(),
        orderId,
        orderDate,
        paymentMethod,
        shippingAddress,
        orderItems,
        total,
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
      } else {
        console.log("Email sent: " + info.response);
console.log({
  receiverName,
  orderId,
  orderDate,
  paymentMethod,
  shippingAddress,
  orderItems,
  total,
});

        return res.status(200).json({ success: true, message: "Order email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Catch error:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
}


module.exports = {
  sendWelcomeEmail,
  sendOrderEmail
};
