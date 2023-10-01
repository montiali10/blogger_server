const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const prisma = require('../configs/db');
const router = require('express').Router();

passport.use(new LocalStrategy( async function verify(username, password, cb) {
    try {
        const user = await prisma.user.findFirst({
            where: { email: username }
        });
        console.log(user);
        if (!user) {
            return cb(null, false, { message: "Incorrect email or password."});
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hash) => {
            if (err) { return cb(err); }
            console.log(hash+'\n'+user.password);
            var enc = new TextEncoder();
            if (!crypto.timingSafeEqual(enc.encode(user.password), enc.encode(hash))) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    } catch (error) {
        console.log('[Passport]', error);
        return cd(error);
    }
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.email });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.post('/login/password', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
}));

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.sendStatus(200);
    });
});

router.post('/signup', async function(req, res, next) {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
      if (err) { 
        console.log(err);
        return next(err); }
      try {
        const checkUser = await prisma.user.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (checkUser) {
            res.status(400);
            return res.json({ message: "Email already exists!" });
        }
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword.toString(),
                salt: salt
            }
        });
        var usr  = {
            id: user.id,
            username: user.email
        }
        req.login(usr, function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    });
});

module.exports = router;