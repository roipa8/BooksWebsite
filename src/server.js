import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import findOrCreate from "mongoose-findorcreate";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = path.join(__dirname, "../build");

const app = express();
const port = 3000;

app.use(express.static(buildPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/usersDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err);
        });
});



// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets"
// },
//     function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));

// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/secrets',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/secrets');
//     });

// app.get("/register", (req,res) => {
    
// })

app.post("/register", (req, res) => {
    User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.status(404).json({success: false, message: 'Registration Failed', error: err.message});
        } else {
            passport.authenticate("local")(req, res, function () {
                res.json({success: false, message: 'Registration Failed', error: err.message});
            })
        }
    });
});

app.post('/login', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({success: false, message: 'Server Error', error: err.message});
        }
        if (!user) {
            return res.status(401).json({success: false, message: 'Authentication failed', error: info.message});
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({success: false, message: 'Login error', error: err.message});
            }
            return res.json({success: true, message: 'Successfully authenticated', user: user.username});
        });
    });
});

app.post('/logout', (req,res) => {
    req.logOut((err) => {
        if(err){
            return res.status(500).json({success: false, message: 'Server Error', error: err.message});
        }
        return res.json({success: true, message: 'Successfully logged out'});
    })
})

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
