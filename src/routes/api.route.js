const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ message: "unautherized" });
    }
    return res.json({ message: "It works!"});
});

module.exports = router;