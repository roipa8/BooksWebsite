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
import { Strategy as FacebookStrategy } from 'passport-facebook';
import findOrCreate from "mongoose-findorcreate";
import "dotenv/config";
import cors from 'cors';
import { redirect } from "react-router-dom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = path.join(__dirname, "../build");

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:3000' }));

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

mongoose.connect("mongodb://127.0.0.1:27017/booksUsersDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    facebookId: String,
    cart: [
        {
            startingDate: { type: Date, default: Date.now },
            rentalDuration: { type: Number, default: 0 },
            bookId: String
        }
    ]
});

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



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/books"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/auth/google', function (req, res, next) {
    passport.authenticate('google', { scope: ['profile'] })(req, res, next);
});


app.get('/auth/google/books',
    passport.authenticate('google', { failureRedirect: '/auth/failedAuth' }),
    function (req, res) {
        req.session.user = {
            googleId: req.user.googleId,
            facebookId: ""
        };
        res.redirect('/');
    }
);


passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/books"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/books',
    passport.authenticate('facebook', { failureRedirect: '/auth/failedAuth' }),
    function (req, res) {
        req.session.user = {
            googleId: "",
            facebookId: req.user.facebookId
        };
        res.redirect('/');
    }
);

app.get('/getUserData', function (req, res) {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false, message: 'User not logged in' });
    }
});


app.get("/auth/failedAuth", (req, res) => {
    return res.json({ success: false, message: 'Authentication failed' });
});

app.get('/isAuthenticated', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});


app.post("/register", (req, res) => {
    User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
        if (err) {
            console.error(err);
            res.status(404).json({ success: false, message: 'Registration Failed', error: err.message });
        } else {
            passport.authenticate("local")(req, res, function () {
                res.json({ success: true, message: 'Registration Successful', user: user.username });
            })
        }
    });
});

app.post('/login', (req, res) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server Error', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed', error: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Login error', error: err.message });
            }
            return res.json({ success: true, message: 'Successfully authenticated', user: user.username });
        });
    })(req, res);
});

app.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server Error', error: err.message });
        }
        return res.json({ success: true, message: 'Successfully logged out' });
    })
});

app.patch('/addBook', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const filter = {
            $or: [
                { username: userId.userName },
                { googleId: userId.googleId },
                { facebookId: userId.facebookId }
            ]
        };
        const update = {
            $push: { cart: { bookId: bookId } }
        };
        const result = await User.updateOne(filter, update);
        if (result.nModified === 0) { // No ducuments were modified
            return res.status(404).json({ success: false, message: "User not found", error: err.message });
        };
        const user = await User.findOne(filter);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, message: "User successfully updated", cartSize: user.cart.length });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    };
});

app.get('/getUserBooksData', async (req, res) => {
    try {
        const userId = req.query.userId;
        const filter = {
            $or: [
                { username: userId.userName },
                { googleId: userId.googleId },
                { facebookId: userId.facebookId }
            ]
        };
        const user = await User.findOne(filter);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, message: "User's books data successfully retrieved", cartItems: user.cart, numOfBooks: user.cart.length });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

app.delete('/removeBook', async (req, res) => {
    try {
        const { userId, bookId } = req.query;
        const filter = {
            $or: [
                { username: userId.userName },
                { googleId: userId.googleId },
                { facebookId: userId.facebookId }
            ]
        };
        const update = {
            $pull: { cart: { bookId: bookId } }
        };
        const result = await User.updateOne(filter, update);
        if (result.nModified === 0) { // No ducuments were modified
            return res.status(404).json({ success: false, message: "User not found", error: err.message });
        };
        const user = await User.findOne(filter);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, message: "User successfully updated", cartSize: user.cart.length });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    };
});

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
