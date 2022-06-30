const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const bodyParser=require('body-parser');
const flash=require('connect-flash')
const session=require('express-session');
const passport = require('passport');

const app=express();

require('./config/passport')(passport);

//body parser
app.use(bodyParser.urlencoded({extended:false}));

//Express Session middleware
app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
  }));

//dotenv configuration
dotenv.config();

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use((req,res,next) => {
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    next();
})

//

const db=process.env.DB_CONNECT_URI;

mongoose.connect(db,{useNewUrlParser:true});
mongoose.connection.once('open',()=>{
    console.log("Connected successfully");
    // console.log(mongoose.connection);
}).on('error',(err)=>{
    console.error("MongoDB ERROR: "+err);
})

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

app.use('/',require('./routes/index'));


app.use('/users',require('./routes/users'));

app.listen(3000,()=>{
    console.log('app listening on port 3000')
})