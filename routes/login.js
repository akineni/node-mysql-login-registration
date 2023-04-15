const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const mysqlConnection = require('../mysql/connection')
const {isLoggedIn} = require('../middlewares/common')

const router = require('express').Router()
const feedbackMsg = 'User not registered. Please <a class="alert-link" href="/register">click here</a> to register'

router.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded

router.get('/', isLoggedIn, (req, res) => {
    res.render('login')
})

router.post('/', isLoggedIn, (req, res) => {
    mysqlConnection.query('SELECT * FROM ?? WHERE email = ?', 
    [process.env.DB_USER_TBL, req.body.email], 
    (err, row) => {
        if(err) throw err;

        if(row.length == 0) return res.render('login', {feedback: feedbackMsg})
        bcrypt.compare(req.body.password, row[0].password, function(err, result) {
            if(err) throw err;

            if(result){
                req.session.isLoggedIn = true
                req.session.UID = row[0].id

                res.redirect('/dashboard')
            }else
                res.render('login', {feedback: feedbackMsg})
        });
    });
})

module.exports = router