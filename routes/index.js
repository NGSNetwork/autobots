const express = require('express');
const router = express.Router();

const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const config = require('../config/website.json');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'NGS Network\'s bots!'});
});

passport.serializeUser((user, done) => {
	done(null, user._json);
});

passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(new SteamStrategy({
		returnURL: config.steamReturnUrl,
		realm: config.steamRealm,
		apiKey: config.steamApiKey
	}, (identifier, profile, done) => {
		return done(null, profile);
	}
));

router.use(session({
    secret: config.indexSessionSecret,
    name: 'U_SESSION',
    resave: true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

router.get(/^\/auth\/steam(\/return)?$/,
	passport.authenticate('steam', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/panel');
	});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
