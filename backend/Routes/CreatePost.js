const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const RequireLogin = require('../middlewares/RequireLogin')
const POST = mongoose.model("POST")


// Route
router.get("/allposts",RequireLogin, (req, res) => {
    let limit = req.query.limit
    let skip = req.query.skip
    POST.find()
    .populate("postedBy", "_id name Photo")
    .populate("comments.postedBy", "_id name")
    .skip(parseInt(skip))
    .limit(parseInt(limit))

    .sort("-createdAt")
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})


router.post("/createPost",RequireLogin, (req, res) => {
    const {pic, body} = req.body
    if(!pic || !body){
        return res.status(422).json({error: "Please add all the fields"})
    }
    req.user
    const post = new POST({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result) => {
        return res.json({post:result})
    }).catch(err => console.log(err))
})

// ALL MY POST

router.get("/mypost",RequireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name ")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")


    .then(myposts => {
        res.json(myposts)
    })
})

// This is for the Likes

router.put('/like', RequireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { likes: req.user._id }
            },
            {
                new: true
            }
        ) .populate("postedBy", "_id name Photo")
        .exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});


// UnLIKE

router.put('/unlike', RequireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            {
                $pull: { likes: req.user._id }
            },
            {
                new: true
            }
        ).populate("postedBy", "_id name Photo")
        .exec();

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});


// CoMMENTS

router.put("/comment", RequireLogin, async(req, res) => {
    const comment = { 
        comment: req.body.text,
        postedBy: req.user._id
    }

    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, { $push:{comments :comment }},{new :true}).populate("comments.postedBy", "_id, name")
        .populate("postedby","_id name Photo")
        .exec()
        res.json(result)
    } catch (error) {
        res.status(422).json({error: err.message})
    }
 
})

// API TO DELETE POST

router.delete("/deletePost/:postId", RequireLogin,  (req, res) => {
      POST.findById(req.params.postId)
        .populate("postedBy", "_id")
        .exec()
        .then((post) => {
            if (!post) {
                return res.status(422).json({ error: "Post not found" });
            }

            if (post.postedBy._id.toString() === req.user._id.toString()) {
                return post.deleteOne();
            } else {
                return res.status(401).json({ error: "Unauthorized access" });
            }
        })
        .then(() => {
            return res.json({ message: "Deleted" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        });
});


// TO SHOW FOLLOWING POST

router.get("/myfollowingpost" , RequireLogin, (req, res) => {
    POST.find({ postedBy:{$in: req.user.following} })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id, name")
    .then(posts => {
        res.json(posts)
    })
    .catch(err => {console.log(err);})
})

module.exports = router