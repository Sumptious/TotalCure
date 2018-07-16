require('dotenv').config();
const express= require('express'),
app = express(),
nodemailer = require ('nodemailer'),
path = require ('path'),
cookieParser = require('cookie-parser'),
session = require('express-session');
flash = require('express-flash'),
sessionStore = new session.MemoryStore,
bodyParser = require ('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});

var middlewares = [
  bodyParser.urlencoded({extended: false})
];
var PORT = process.env.PORT || 3000;

app.use(express.static (path.join(__dirname + '/public')));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: process.env.value
}));
app.use(flash());

app.get('/', function (req, res) {
  res.render('index');
});

// //POST route from order and contact form
app.post('/send', urlencodedParser, function (req, res) {
  // console.log(req.body)
    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MY_NAME,
            pass: process.env.Settings
        }
        
    });

    mailOpts = {
        from: 'Total Cure website',
        to: process.env.MY_NAME,
        subject: 'New message from Order form',
        text: ` 
    Name:     ${req.body.name} 
    Email:    ${req.body.email} 
    Address:  ${req.body.address} 
    State:    ${req.body.state} 
    Product:  ${req.body.product} 
    UlcerMed: ${req.body.ulcer} 
    EyeMed:   ${req.body.eye}  
              ${req.body.myName} 
              ${req.body.myEmail}
              ${req.body.myPhone} 
              ${req.body.myMessage}`
      };
      smtpTrans.sendMail(mailOpts, function (error, req, res) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email was sent successfully');
        }
      });
      console.log(req.body);
      req.flash('success', 'Thanks for the message! I\'ll be in touch' );
      req.flash('error', 'Message not sent!' );
      res.redirect('/');
    
    });

    app.listen(PORT, function() {
      console.log('app listening on port' + ' ' + PORT)
    });
