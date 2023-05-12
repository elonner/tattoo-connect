const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
    }, 

    async function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) return cb(null, user);
            user = await User.create({
                firstName: profile.name.familyName,
                lastName: profile.name.givenName,
                email: profile.emails[0].value,
                googleId: profile.id
            });
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(async function(userId, cb) {
    cb(null, await User.findById(userId));
});