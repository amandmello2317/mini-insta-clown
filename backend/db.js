const mongoose = require('mongoose')

const URL = "mongodb://0.0.0.0:27017/insta"

const ConnectDB = async(req, res) => {
    try {
        await mongoose.connect(URL)
        console.log("Connected");
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = ConnectDB