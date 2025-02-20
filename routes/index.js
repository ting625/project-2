const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('home', { title: 'Home page' });
});

router.get('/blog', (req, res) => {
  //res.send('It works!');
  res.render('blog', { title: 'Blog page' });
});

router.get('/registrants', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrants', { title: 'Listing registrations', registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
}));

// For debugging only, can be commented later
router.get('/error_msg', (req, res) => {
  //res.send('It works!');
  res.render('error_msg', { title: 'Error message page' });
});

// For debugging only, can be commented later
router.get('/thankyou', (req, res) => {
  //res.send('It works!');
  res.render('thankyou', { title: 'Thank you page' });
});


router.post('/', 
    [
        check('email')
        .isLength({ min: 1 })
        .withMessage('! Error: Please enter an email'),

        check('phone')
        .isLength({ min: 1 })
        .withMessage('! Error: Please enter a phone'),

        check('name')
        .isLength({ min: 1 })
        .withMessage('! Error: Please enter a name'),

        check('preference')
        .isLength({ min: 1 })
        .withMessage('! Error: Please enter a preference'),
    ],

    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const registration = new Registration(req.body);

          // generate salt to hash password
          // const salt = await bcrypt.genSalt(10);
          // set user password to hashed password
          // registration.password = await bcrypt.hash(registration.password, salt);
          
          registration.save()

            .then(() => {
              res.render('thankyou', { title: 'Thank you page' });
              //res.send('Thank you for your registration!');
            })
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });

        } else {
            res.render('error_msg', { 
                title: 'Error message page',
                errors: errors.array(),
                data: req.body,
             });
        }
    });
    

module.exports = router;