const express = require('express');
const cors = require('cors');
const ConnectDB = require('./db');


require('./Models/UserSchema')
require('./Models/PostSchema')

const app = express()
const port = process.env.port || 5000;

app.use(cors())

ConnectDB()

app.use(express.json())
app.use(require("./Routes/auth"))
app.use(require("./Routes/CreatePost"))
app.use(require("./Routes/User"))


app.listen(port, () => {
    console.log(`server is running in ${port}`);
})