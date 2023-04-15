const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const mysqlConnection = require('../mysql/connection')
const {isLoggedIn} = require('../middlewares/common')

const router = require('express').Router()
const saltRounds = 10;

router.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
router.use(bodyParser.json());

router.get('/', isLoggedIn, (req, res) => {
    res.render('register')
})

router.post('/', isLoggedIn, [
    body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .custom(value => {
        return new Promise((resolve, reject) => {
            mysqlConnection.query('SELECT username FROM ?? WHERE username = ?', 
            [process.env.DB_USER_TBL, value],
            (err, row) => {
                if(err) throw err;

                if(row.length > 0) reject('Username already in use')
                resolve()
            })
        })
    }),

    body('email')
    .isEmail().withMessage('Invalid email')
    .custom(value => {
        return new Promise((resolve, reject) => {
            mysqlConnection.query('SELECT email FROM ?? WHERE email = ?', 
            [process.env.DB_USER_TBL, value],
            (err, row) => {
                if(err) throw err;

                if(row.length > 0) reject('Email already in use')
                resolve()
            })
        })
    }),

    body('password')
    .isLength({min: 8}).withMessage('Minimum length of \'8\''),

    body('confirm_password')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        
        // Indicates the success of this synchronous custom validator
        return true;
      })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var err = [];
        errors.array().forEach(currentValue => {
            err[currentValue.param] = currentValue.msg
        })
         return res.render('register', {body: req.body, errors: err})
    }

    delete req.body['confirm_password']

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err) throw err;

        req.body.password = hash

        mysqlConnection.query('INSERT INTO ?? SET ?', [process.env.DB_USER_TBL, req.body], (err) => {
            if(err) throw err;
    
            res.redirect('/login')
        });
    });    
})

module.exports = router