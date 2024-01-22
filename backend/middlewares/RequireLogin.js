const jwt = require('jsonwebtoken')
const {Jwt_secret} = require("../Keys")

const mongoose = require('mongoose')
const USER = mongoose.model("USER")

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({
            error: "You Must Login 1"
        })
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, Jwt_secret,(err, payload) => {
        if(err) {
            return res.status(401).json({error: "You must login 2"})
        }
        const {_id} = payload
        USER.findById(_id).then(userData => {
            req.user = userData
            next()
        })
    })
}