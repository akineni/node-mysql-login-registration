const express = require('express')

const app = express()
const port = 3000
const host = 'localhost'

app.engine('html', require('ejs').renderFile)

app.set('view engine', 'html')

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('./public')) //serve static files in ./public
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/', require('./routes/root'))

app.listen(port, () => { 
  console.log(`Example app listening at http://${host}:${port}`)
})