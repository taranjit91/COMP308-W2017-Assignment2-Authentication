// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the game model
let game = require('../models/businesscontacts');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET businesscontacts List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all businesscontacts in the businesscontacts collection
  game.find( (err, businesscontacts) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('businesscontacts/index', {
        title: 'businesscontacts',
        businesscontacts: businesscontacts,
        displayName: req.user.displayName
      });
    }
  });

});

//  GET the Game Details page in order to add a new Game
router.get('/add', requireAuth, (req, res, next) => {
  res.render('businesscontacts/details', {
    title: "Add a new Game",
    businesscontacts: '',
    displayName: req.user.displayName
  });
});

// POST process the Game Details page and create a new Game - CREATE
router.post('/add', requireAuth, (req, res, next) => {

    let newGame = game({
      "name": req.body.name,
      "cost": req.body.cost,
      "rating": req.body.rating
    });

    game.create(newGame, (err, game) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.redirect('/businesscontacts');
      }
    });
});

// GET the Game Details page in order to edit a new Game
router.get('/:id', requireAuth, (req, res, next) => {

    try {
      // get a reference to the id from the url
      let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        // find one game by its id
      game.findById(id, (err, businesscontacts) => {
        if(err) {
          console.log(err);
          res.end(error);
        } else {
          // show the game details view
          res.render('businesscontacts/details', {
              title: 'Game Details',
              businesscontacts: businesscontacts,
              displayName: req.user.displayName
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.redirect('/errors/404');
    }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
    let id = req.params.id;

     let updatedGame = game({
       "_id": id,
      "name": req.body.name,
      "cost": req.body.cost,
      "rating": req.body.rating
    });

    game.update({_id: id}, updatedGame, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the game List
        res.redirect('/businesscontacts');
      }
    });

});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
  // get a reference to the id from the url
    let id = req.params.id;

    game.remove({_id: id}, (err) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        // refresh the businesscontacts list
        res.redirect('/businesscontacts');
      }
    });
});


module.exports = router;