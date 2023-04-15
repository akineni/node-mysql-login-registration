const express = require('express')
const { isLoggedOut } = require("../middlewares/common")
const mysqlConnection = require('../mysql/connection')

const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/dashboard', isLoggedOut, (req, res) => {
    mysqlConnection.query('SELECT * FROM ?? WHERE id = ?', 
        [process.env.DB_USER_TBL, req.session.UID], 
        (err, row) => {
            if (err) throw err

            res.render('dashboard', {user: row[0]})
        }
    )
})

router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.redirect('/login')
    }) 
})

router.use('/', (req, res) => {
    res.status(404).send('<h3>Not Found</h3>')
})

module.exports = router