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

mongoose.connect("mongodb://127.0.0.1:27017/booksUsersDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    facebookId: String,
    deadlineStatus: {type: Boolean, default: false},
    cart: [
        {
            startingDate: { type: Date, default: Date.now },
            deadlineDate: Date,
            rentalDuration: { type: Number, default: 0 },
            bookId: String,
            status: { type: String, enum: ['read', 'unread'], default: 'unread' }
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
        if (result.n === 0) { // No ducuments matches the filter were modified
            return res.status(404).json({ success: false, message: "User not found", error: err.message });
        } else if (result.nModified === 0) { // No documents were modified
            return res.status(404).json({ success: false, message: "User not found", error: err.message });
        }
        return res.json({ success: true, message: "User successfully updated" });
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
        return res.json({ success: true, message: "User's books data successfully retrieved", cartItems: user.cart });
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
        if (result.n === 0) { // No ducuments matches the filter were modified
            return res.status(404).json({ success: false, message: "User not found", error: err.message });
        } else if (result.nModified === 0) { // No documents were modified
            return res.status(404).json({ success: false, message: "User not found", error: err.message });
        }
        return res.json({ success: true, message: "User successfully updated" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    };
});

app.patch('/markAsRead', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
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
        const cartItem = user.cart.find(item => item.bookId === bookId);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        cartItem.status = 'read';
        await user.save();
        return res.json({ success: true, message: "Book marked as read succefully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

app.get('/getDeadlineStatus', async (req, res) => {
    try {
        const { userId } = req.query;
        console.log('Received query:', req.query);
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
        return res.json({ success: true, message: "Deadline succefully recieved", deadlineStatus: user.deadlineStatus });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

app.patch('/setDeadline', async (req, res) => {
    try {
        const { userId, bookId, date } = req.body;
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
        const cartItem = user.cart.find(item => item.bookId === bookId);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }
        cartItem.deadlineDate = date;
        await user.save();
        return res.json({ success: true, message: "Deadline date has been set succefully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
})

app.patch('/toggleDeadlineStatus', async (req, res) => {
    try {
        const { userId } = req.body;
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
        user.deadlineStatus = !user.deadlineStatus;
        await user.save();
        return res.json({ success: true, message: "User deadline status changed succefully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
