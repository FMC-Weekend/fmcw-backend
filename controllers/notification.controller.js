const nodemailer = require("nodemailer");
// dotenv.config({
//     path: "./config.env",
// });
exports.contactUs = async (ip, email,name) => {
    // const { name, email, message } = req.body;
    // const ip = req.ip;
    // const messs = `New Contact Us Request\n
    // Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL1,
            pass: process.env.PASS1,
        }
    });
    const mailOptions = {
        from: "FMC WEEKEND",
        to: `${email}`,
        subject: "FMC WEEKEND",
        html: `
        <!DOCTYPE html>
<html>
<head>
    <style>
      
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
        }

        .header h1 {
            color: #333;
        }

        .content {
            margin-top: 20px;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Login Detected</h1>
        </div>

        <div class="content">
            <p>Hello ${name} </p>

            <p>We detected a recent login to your account from the following location:</p>
          
            <p>IP Address: ${ip}</p>
            <p>Date and Time: [Date and Time]</p>

            <p>If this login was not authorized by you, please take immediate action by contacting our support team <b>Mr. Shubham(6201060889)</b></p>

            <p>Thank you for using our service.</p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>


        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            // console.log("Email sent to:" +` ${name} `+info.response);
            res.send("Email Sent.")
        }


    })
}