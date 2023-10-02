const router = require('express').Router();
const prisma = require('../../configs/db');
const { postBlog, getBlog } = require('../../models/Blog');

router.get('/feed', (req, res) => {
    
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const blog = await getBlog(id);
        if (!blog) {
            res.status(404);
            return res.json({ message: "No blog with this ID." });
        }
        res.status(200);
        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(400)
        return res.json({ message: "Something went wrong" });
    }
});

router.post('/create', async (req, res) => {
    const values = req.body;
    try {
        await postBlog({ 
            title: values.title,
            content: values.content,
            summary: values.summary,
            autherId: values.autherId
        });
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(400);
        return res.json({ message: "Something went wrong." });
    }
});

router.put('/update', (req, res) => {

});

module.exports = router;