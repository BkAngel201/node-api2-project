const express = require('express')
const Posts = require('../data/db.js')

const router = express.Router()

router.get('/', async (req, res) => {

    try {
        const posts = await Posts.find(req.query)
        res.status(200).json(posts)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "The posts information could not be retrieved."
        })
    }
})

router.post('/', async (req, res) => {
    const body = req.body
    if(body.title && body.contents) {
        try {
            const post = await Posts.insert(body)
            res.status(201).json({...post, ...body})
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        }
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

router.post('/:id/comments', async (req, res) => {
    const { id } = req.params
    console.log(req.params);

    try {
        const post = await Posts.findById(id)
        if(post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            const body = req.body
            if(body.text) {
                try {
                    const comment = await Posts.insertComment({...body, post_id: id})
                    res.status(201).json({...comment, ...body})
                }
                catch (commentErr) {
                    console.log(commentErr);
                    res.status(500).json({ error: "There was an error while saving the comment to the database" })
                }
            } else {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }
        }
    }
    catch (postErr) {
        console.log(postErr);
        res.status(500).json({ message: "Error to retrieve info from DB" })
    }
})


router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const post = await Posts.findById(id)
        if(post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(post)
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "The post information could not be retrieved." })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params

    try {
        const post = await Posts.findById(id)
        if(post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            try {
                const comments = await Posts.findPostComments(id)
                res.status(200).json(comments)
            }
            catch (commentErr) {
                res.status(500).json({ error: "The comments information could not be retrieved." })
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "The post information could not be retrieved." })
    }
})





module.exports = router;
