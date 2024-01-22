const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const RequireLogin = require('../middlewares/RequireLogin')
const POST = mongoose.model("POST")
const USER = mongoose.model("USER")


// TO GET USER PROFILE
router.get("/user/:id", async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.params.id }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User Not found" });
        }

        const posts = await POST.find({ postedBy: req.params.id })
            .populate("postedBy", "_id")
            .exec();

        res.status(200).json({ user, posts });
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});


// TO FOLLOW USER
router.put("/follow", RequireLogin, async(req, res) => {
    try {
        const updatedFollowedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        const updatedCurrentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json(updatedCurrentUser);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});


// TO UNFOLLW USER

router.put("/unfollow", RequireLogin, async(req, res) => {
    try {
        const updatedFollowedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        const updatedCurrentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        res.json(updatedCurrentUser);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});


// TO UPLOAD PROFILE PCI

router.put("/uploadProfilePic", RequireLogin, async (req, res) => {
    try {
        const updatedUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.pic } },
            { new: true }
        ).exec();

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});

module.exports = router
