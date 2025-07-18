const mailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

async function sendEmail(req, res) {
  try {
    const { supportEmail } = 'isabiryealexx@gmail.com';

    const transporter = mailer.createTransport({
      host: 'smt.ethereal.email',
      port: 587,
      secure:false,
      service: "gmail",
      auth: {
        user: "mk5143195@gmail.com",
        pass: "xnmvmpivkvjtmidp",
      },
    });
    const mailOptions = {
      from: '"GoShop" mk5143195@gmail.com',
      to: "7526878@gmail.com",
      subject: "Your Order has been Received",
      text: "That was easy",
      template: 'order',
      context: {
        name,company,supportEmail, website, year: new Date().getFullYear()
      },
      
    };
    // Configure Handlebars
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          layoutsDir: "",
          defaultLayout: false,
          partialsDir: path.resolve('./views/'),
          layoutsDir:path.resolve('./views/')
        },
        viewPath: path.resolve("./views/"),
        extName: ".hbs",
      })
    );

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Unknown error occured:", error);
      } else {
        console.log("Email Sent:" + info.response);
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send email",
        error: error.message,
      });
  }
}

module.exports = {
  sendEmail,
};
