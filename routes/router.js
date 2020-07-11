const express = require('express');
const router = express.Router();
const User = require('./../models/model');
var bcrypt = require('bcryptjs');

router.get('/register',(req, res)=>{
  res.render('register',{data : ''});
});

//registration routing
router.post('/register', async(req, res)=>{
  let name = req.body.name;
  let email = req.body.email;
  let password1 = req.body.password1;
  let password2 = req.body.password2;

  if(!name || !email || !password1 || !password2)
  {
     res.render('register',{data : 'fill all fields carefully!'});
  }
  else
  {
    if(password1 === password2 && password1.length >= 6)
    {

      let result = await User.findOne({email : email});
      if(result)
        res.render('register',{data : 'email already exists!'});
      else{
        let hashpassword = bcrypt.hashSync(password1, 10);
        const newUser = new User({
          name : name,
          email : email,
          password : hashpassword
        });
        const result = await newUser.save();
        //if(resutl=>console.log('saved susscessfully',result));
        res.render('register',{data : 'susscessfully registered!'});
      }
   }
   else
   {
     res.render('register',{data : 'password length should be at least 6 digits/number'})
   }
  }
});
router.get('/login',(req, res)=>{
  res.render('login',{data : ''});
});


//login routing
router.post('/login', async(req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  if(!email || !password)
  {
    res.render('login',{data : '  enter a valid email or password!'});
  }
  else{

    const result = await User.findOne({email : email});

      if(result){

        if(bcrypt.compareSync(password,result.password)){
          //password matched
          req.session.loggedIn = true;
          req.session.name = result.name;
          res.redirect('/pages/dashboard');

      }else{
        res.render('login',{data : 'invalid email or password!'});
      }

  }
}

});
router.get('/dashboard',(req, res)=>{
  if(req.session.loggedIn){
    res.render('dashboard',{data : req.session.name});
  }else{
    res.render('dashboard',{data : 'please login!'});
  }

});

router.get('/logout', (req, res)=>{
  req.session.loggedIn = false;
  res.redirect('/pages/login');
});


module.exports = router;
