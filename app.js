// ENVIRONMENT VARIABLES CONFIGURATION
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env'
});

// MODULES & IMPORTS
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const paymentDetails = require('./controllers/pa.controller')
// const CryptoJS = require('crypto-js');
const cors = require('cors');

app.use(cors());

// var cors = require("cors");
// var session = require("express-session");
// var nodemailer = require("nodemailer");
// var cookieparser = require("cookie-parser");
// var axios = require("axios");
// var randomstring = require("randomstring");
// const SessionStore = require('express-session-sequelize')(session.Store);
// var https = require('https');
// const checksum_lib = require('./Paytm/checksum/checksum.js');

// app.use(cors({
//   origin:[
//     "https://localhost:4200",
//     "http://localhost:4200",
//     "https://fmcweekend.in",
//     "http://fmcweekend.in"
//   ],//frontend server localhost:8080
//   methods:['GET','POST','PUT','DELETE'],
//   credentials: true // enable set cookie
//  }));
//Express-session
// app.use(cookieparser("FMC is love, FMC is life"));
// app.use(
//   session({
//     secret: "FMC is love, FMC is life",
//     proxy: true,
//     httpOnly : false,
//     resave: true,
//     secure: true,
//     saveUninitialized: true,
//     store: models.sequelizeSessionStore,
//     cookie : {
//       secure: true,
//       httpOnly: false,
//     }
//     // store: MongoStore.create({
//     //   mongoUrl:
//     //     "mongodb://gmail_auth:gmail_auth@fmc-shard-00-00.fsipp.mongodb.net:27017,fmc-shard-00-01.fsipp.mongodb.net:27017,fmc-shard-00-02.fsipp.mongodb.net:27017/fmcweek?ssl=true&replicaSet=fmc-shard-0&authSource=admin&retryWrites=true&w=majority",
//     // }),
//   })
// );
// app.use(cors(corsOptions));

const { loginFunc, logoutFunc, verifyToken } = require('./services/googleAuth');

// MIDDLEWARE
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static('.'));
app.set('view engine', 'ejs');

// CORS
// app.use(function (req, res, next) {
//   const allowedOrigins = [
//     "https://localhost:4200",
//     "https://localhost:5500",
//     "http://localhost:4200",
//     "https://fmcweekend.in",
//     "http://fmcweekend.in",
//     "https:\/\/(?:.+.)?.herokuapp.com\/"
//   ];
//   // res.setHeader("Access-Control-Allow-Origin", "*");
//   const origin = req.headers.origin;
//   res.setHeader("Access-Control-Allow-Origin", origin || '*');
//   // if (allowedOrigins.includes(origin)) {
//   //   res.setHeader("Access-Control-Allow-Origin", origin);
//   // }
//   // Website you wish to allow to connect
//   // res.setHeader('Access-Control-Allow-Origin', 'https://fmcmerch.herokuapp.com');
//   // res.setHeader('Access-Control-Allow-Origin', 'https://localhost:5500');
//   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });
//Admin DashBoard
app.use(express.static("public"));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const admin_auth = require('./middleware/admin_auth');
app.use(cookieParser());
app.get('/', (req, res) => {
  res.render('admin_login');
}
);
app.get('/register', (req, res) => {
  res.render('admin_register');
});
const userModel = require('./models/admin_user');
//bcrypt
const bcrypt = require('bcryptjs');

const saltRounds = 10;
app.post('/register', async (req, res) => {
  try {

    var { username, password, name } = req.body;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);
    password = hash;
    const user = new userModel({
      username: username,
      password: password,
      name: name
    });
    const token = await user.generateAuthToken(); //model me jakar generateAuthToken function ko call kia
    //cookie me token ko save kia
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
      // secure:true
    });
    // console.log(user);
    await user.save();
    res.status(201).render('login');
  } catch (error) {
    res.status(400).render('error');
    console.log(error);
  }
});
app.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await userModel.findOne({
      username: username,
      // password:password       
    });
    // console.log(users)
    const token = await users.generateAuthToken(); //model me jakar generateAuthToken function ko call kia
    // console.log(token);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3000000),
      httpOnly: true,
      // secure:true
    });
    // console.log(req.cookies.jwt);
    if (users.username === username && bcrypt.compareSync(password, users.password)) {
      // res.send('login successfull');
      res.render("adminDashboard", {
        Details: Details,
        total: total,
        totalOrders: totalOrders,
        totalPayments: totalPayments
      });
    }
    else {
      res.render('error');
    }

  } catch (error) {
    res.render('error');
    // res.status(400).render('error');
    // console.log(error);
  }
});
const Details = [];
var total;
var totalOrders = 0;
var totalPayments = 0;
const http = require("https");
app.get("/admindashboard", admin_auth, function (req, res) {
  res.render("adminDashboard", {
    Details: Details,
    total: total,
    totalOrders: totalOrders,
    totalPayments: totalPayments
  });

});
app.get("/admindashboarduser", admin_auth, function (req, res) {
  res.render("users", {
    Details: Details,
    total: total,
    totalOrders: totalOrders,
    totalPayments: totalPayments
  });

});
const options = {
  "method": "GET",
  "hostname": "fmcw-backend1.onrender.com",
  "port": null,
  "path": "/api/alluser",
  "headers": {
    "Accept": "*/*",
  }
};
app.get('/admindashboardUser', function (req, res) {

})
// const req = http.request(options, function (res) {
//   const chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     const body = Buffer.concat(chunks);
//     const n = body.toString();
//     const k = JSON.parse(n);

//     for (let index = 0; index < k.data.length; index++) {
//       var detail = {};
      
//       if (k.data[index].userCart != null) {

//         detail = {
//           name: k.data[index].name,
//           email: k.data[index].email,
//           college: k.data[index].college,
//           instaHandle: k.data[index].instaHandle,
//           number: k.data[index].number,
//           yearOfStudy: k.data[index].yearOfStudy,
//           transactionID: k.data[index].transactionID,
//           id: k.data[index]._id,
//           cartItems: k.data[index].userCart.cartItems,
//         }

        
//         Details.push(detail);

//       //   for (let j = 0; j < k.data[index].userCart.cartItems.length; j++) {
//       //   if(k.data[index].userCart.cartItems[j].verifyStatus===true) {
//       //     total = Details.length;
//       //     totalOrders = totalOrders + k.data[index].userCart.cartItems.length;
//       //   }
//       // }

//       }
//       else {
//         detail = {
//           name: k.data[index].name,
//           email: k.data[index].email,
//           college: k.data[index].college,
//           instaHandle: k.data[index].instaHandle,
//           number: k.data[index].number,
//           yearOfStudy: k.data[index].yearOfStudy,
//           transactionID: k.data[index].transactionID,
//           id: k.data[index]._id,
//           cartItems: []
//         }
//       }

//       for (let j = 0; j < k.data[index].userCart.cartItems.length; j++) {
//         if(k.data[index].userCart.cartItems[j].verifyStatus===true) {
//           Details.push(detail);
//           total = Details.length;
//           totalOrders = totalOrders + k.data[index].userCart.cartItems.length;
//           totalPayments = totalPayments + k.data[index].userCart.cartItems[j].price
//         }
//       }
      
//       var re1 = /@itbhu.ac.in\s*$/;
//       var re2 = /@iitbhu.ac.in\s*$/;
//       const x = re1.test(k.data[index].email) || re2.test(k.data[index].email)
//       if (re1.test(k.data[index].email) || re2.test(k.data[index].email)) {
//         Details.pop(detail);
//         total = Details.length
//     }

      
//     }
//   });
// });

// req.end();
//ROUTERS
const rout = require('./routers/index.router.js');
const eventrout = require('./routers/event.router.js');
const registerrout = require('./routers/register.router.js');
const leaderrout = require('./routers/leader.router.js');
const userrout = require('./routers/user.router');
const cartrout = require('./routers/cart.router');
const paymentrout = require('./services/instamojoPayment');
// const parout = require('./routers/pa.router');

const mailrout = require('./routers/mail.router');
const visitor = require('./routers/visitors');



// ROUTES
app.get('/api/test', (req, res) => {
  res.json({ message: 'API Running successfully' });
})
app.post("/api/google-login", loginFunc);
app.post("/api/verify-token", verifyToken);
app.post('/api/logout', logoutFunc);
app.use('/api', rout);
app.use('/api', eventrout);
app.use('/api', registerrout);
app.use('/api', leaderrout);
app.use('/api', userrout);
app.use('/api', cartrout);
app.use('/api', paymentrout);
app.use('/api', mailrout);
// app.use('/api', parout);

app.use('/api', visitor)
app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Given route does not exist'
  })
})
// const decrypted = CryptoJS.AES.decrypt(encrypted, "Message").toString(CryptoJS.enc.Utf8);
// DATABASE CONNECTION
// const DB = process.env.local_mongo;

const DB = process.env.DATABASE;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to database');
}).catch((err) => {
  console.log('There was some error connecting to the database');
  console.log(err);
})


// APP SETUP
app.listen(process.env.PORT || 8000, function (err, result) {
  console.log(`Server is running at port! ${process.env.PORT}`);
});
