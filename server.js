const express = require('express')

var bodyParser = require('body-parser')

const app = express()
const port = 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const { getUsers, Register, Login, Logout} = require("./controllers/userControllers");

const { verifyToken } = require("./middleware/VerifyToken")

const prefix = "/v1/api/";

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//user apis
app.get(prefix + "users", verifyToken, getUsers);
app.post(prefix + "register", Register);
app.post(prefix + "Login", Login);
app.delete(prefix + "logout", Logout);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})