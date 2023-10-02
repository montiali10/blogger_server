const router = require('express').Router();
const { getUser } = require('../models/User');

router.get('/', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ message: "unautherized" });
    }
    const user = await getUser(7);
    return res.json(user);
});

router.use('/blog', require('./blog/blog.route'));

module.exports = router;