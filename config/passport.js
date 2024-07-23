const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../config/dbConn');
const config = require('./config');

const localLogin = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            let user = await db.userModel.findOne({where: {username: username}, raw: true});
            console.log(user.password, password)
            if (!user) {
                done({
                    status: 400,
                    message: 'USER_NOT_FOUND',
                });
            } else {
                if(user.password === password.toString()) {
                    done(null, user);
                }else{
                    console.log("password_wrong")
                    done({
                        status: 400,
                        message: 'WRONG_PASSWORD',
                    });
                }
            }
        } catch (e) {
            console.log(e);
            done({status: 400, message: 'Login error..!'});
        }

    }
);

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
};

const jwtLogin = new JwtStrategy(
    { ...opts, passReqToCallback: true },
    async (req, jwtPayload, done) => {
        try {
            let user = await db.userModel.findOne({where: {Id: jwtPayload.Id}});
            if (user) {
                const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                if (user.dataValues.accessToken === token) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'TOKEN_MISMATCH' });
                }
            } else {
                return done(null, false, { message: 'USER_NOT_FOUND' });
            }
        } catch (err) {
            return done(err, false);
        }
    }
);

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
