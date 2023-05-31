
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const shopController = require('./controller/shop');
const port = 3000;

const mongoConnect = require('./util/database').mongoConnect;
//const mongoConnect = require('./util/database');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop'); 


//db.execute('SELECT * FROM products').then(result => {console.log(result)}).catch(err => { console.log(err);});

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended: false}));


//saving the req.user so that we can access in admin.js
// we are getting the value of user object
// ie we are having the user object
app.use((req,res, next)=>{
    //next is so that next middleware can be used
    User.findById('64327fe9d43dea05ec0ed2f2').then(user => { 
        //its important to understand
        //that the user we are storing it here
        // will be the object with just the property the data in the database
        //all the methods of the user model will not be in there
        //because the user we are getting here only from the database methods
        //req.user = user;
        //so we do not use this we change this
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    }).catch(err => console.log(err));
   
});

app.use('/admin',adminData.routes);
app.use(shopRoutes);


app.use(shopController.get404);


//client is the value we recieve from mongodb
mongoConnect(() => {
    app.listen(process.env.PORT || port,()=>{ console.log(`listening on port ${port}`)} );
})