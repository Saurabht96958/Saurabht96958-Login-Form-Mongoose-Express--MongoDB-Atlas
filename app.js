const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/router');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;
mongoose.connect(' mongodb+srv://root:1234@cluster0.ljz5n.azure.mongodb.net/test?retryWrites=true&w=majority', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/pages', routes);

app.get('/',(req, res)=>{
   res.render('home');
});



app.listen(PORT);
