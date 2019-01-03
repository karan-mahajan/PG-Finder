var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Pg = require('../models/paras');
/* GET users listing. */

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/add', function(req,res,next){
  var pgname = req.body.pgname;
  var loc1 = req.body.loc1;
  var rent = req.body.rent;
  var max = req.body.max;
  var wifi = req.body.radio;
  var gender = req.body.gender;
  var nearby = req.body.nearby;
  var furniture = req.body.furniture;
  //Validation
  req.checkBody('pgname','PG Name is required').notEmpty();
  req.checkBody('loc1','Location is required').notEmpty();
  req.checkBody('rent','Rent is required').notEmpty();
  req.checkBody('max','Maximum Roommates required').notEmpty();
  req.checkBody('nearby','Provide nearby places').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.render('provider',{errors:errors});
  }
  else{
    var newPG = new Pg({
    pgname: pgname,
    loc1: loc1,
    rent: rent,
    max: max,
    gender: gender,
    wifi: wifi,
    nearby: nearby,
    furniture: furniture
  });
    Pg.addPG(newPG,function(err,pg){
      if(err) throw err;
      console.log(pg);
    });
    req.flash('success_msg', 'PG Added');
    res.redirect('/users/dashboard');
  }
});


router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var address = req.body.address;
  var password = req.body.password;
  var password2 = req.body.password2;
  var selftype = req.body.optradio;
  //Validation
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('address','Address is not valid').notEmpty();
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('password2','Pasword does not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
  	res.render('register',{
  		errors:errors
  	});
  }
  else
  {
  	var newUser = new User({
  		name: name,
  		email: email,
  		username: username,
  		address: address,
  		password: password,
      selftype: selftype
  	});
  	User.createUser(newUser, function(err,user){
  		if(err) throw err;
  		console.log(user);
  	});
  	req.flash('success_msg', 'You are registered');
  	res.redirect('/users/login');
  }
});
passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null,false, {message:' Unknown User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,user);
        }
        else{
          return done(null,false,{message: 'Invalid Password'});
        }
      });
    });
    }));

passport.serializeUser(function(user, done){
  done(null,user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  });
});
router.post('/login', passport.authenticate('local', {successRedirect:'/users/dashboard', failureRedirect:'/users/login',failureFlash: true}), function(req,res){
res.redirect('/users/dashboard');
});

router.get('/dashboard', ensureAuthenticated, function(req,res){
  var pg_array = [];
  Pg.returnPG(function(err,cursor){
    //if(err) throw err;
    if(cursor){
      cursor.forEach(function(doc,err){
        console.log(doc);
        pg_array.push(doc);
      });
    }
  });
  res.render('dashboard',{items:pg_array});
});

//Need PG
router.get('/want', function(req,res){
  res.render('want');
});

//Add PG
router.get('/provide',function(req,res){
  res.render('provide');
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg','Please login first');
    res.redirect('/users/login');
  }
}

router.get('/logout',function(req,res){
  req.logout();
  req.flash('success_msg','You are  logged out');
  res.redirect('/users/login');
});
module.exports = router;
