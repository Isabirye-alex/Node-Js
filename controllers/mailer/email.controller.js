const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");



async function sendWelcomeEmail(req, res) {
  try {
    const supportEmail = "alex.isabirye@pearl-host.com"; 
    const company = "XShop";
    const website = "https://yourdomain.com"; 
    const { receiver, receiverName } = req.body;
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465, 
      secure: true,
      auth: {
        user: "alex.isabirye@pearl-host.com", 
        pass: "0752687851@Al",
      },
    });

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
      from: `"${company}" <alex.isabirye@pearl-host.com>`, 
      to: receiver,
      replyTo:'alex.isabirye@pearl-host.com',
      subject: "Account Activated Ready to Explore",
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
        return res.status(200).json({ success: true, message: "Email sent successfully" });
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
    const supportEmail = "alex.isabirye@pearl-host.com";
    const company = "XShop";
    const website = "https://lex.pearl-host.com"; 

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
      host: "smtp.hostinger.com",
      port: 465, 
      secure: true, 
      auth: {
        user: "alex.isabirye@pearl-host.com", 
        pass: "0752687851@Al",
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
      from: `"${company}" <alex.isabirye@pearl-host.com>`,
      to: receiver,
      replyTo: 'alex.isabirye@pearl-host.com',
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
  sendOrderEmail,
};
