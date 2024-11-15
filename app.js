const express = require('express'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //cookies
const axios = require('axios');
const multer = require('multer'); //post form handler
//db
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require("cors"); //to allow fetching

const PORT = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//post form handlers
app.use(multer().none());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const ONE_WEEK = 604800000;

//get database connection
async function getDBConnection() {
    return await sqlite.open({
        filename: "database.db",
        driver: sqlite3.Database
    });
}

//redirect to / if logged in
function goHomeIfLoggedIn(req, res) {
    const currUser = req.cookies["currentUser"];
    if (currUser !== undefined) {
        res.redirect("/");
    }
}

//redirect to /about if logged out
function goAboutIfLoggedOut(req, res) {
    const currUser = req.cookies["currentUser"];
    if (currUser === undefined) {
        res.redirect("/about");
    }
}

//if the user is logged in, go to home, otherwise, go to about
app.get('/', (req, res) => {
    goAboutIfLoggedOut(req, res);
    res.sendFile(__dirname + "/public/index.html")
});

//Stack Overflow says this needs to be declared after / route
// https://stackoverflow.com/questions/25166726/express-serves-index-html-even-when-my-routing-is-to-a-different-file
app.use(express.static('public'));

//if the user is logged in, go to home, otherwise go to about
app.get('/about', (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/about.html");
});

//login form route, logged in users are redirected
app.get("/login", (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/login.html");
});

//register form route, logged in users are redirected
app.get("/register", (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/register.html");
});


//reset password form route, logged in users are redirected
app.get("/reset-password", (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/reset.html");
});

//customize account form route, logged out users are redirected
app.get("/customize", (req, res) => {
    goAboutIfLoggedOut(req, res);
    res.sendFile(__dirname + "/public/customize.html");
});

//add new art supply form route, logged out users are redirect
app.get("/add-new", (req, res) => {
    goAboutIfLoggedOut(req, res);
    res.sendFile(__dirname + "/public/add-new.html");
});

//handle login form submission route (POST)
app.post("/login", async (req, res) => {
    res.type("txt");
    const email = req.body.email;
    const password = req.body.password;
    const query = "SELECT user_id, user_alias, profile_picture FROM users WHERE user_email = ? AND user_password = ?";
    let db = null;
    try {
        db = await getDBConnection();
        const user = await db.get(query, [email, password]);
        //if there is no user with the provided credentials, return status 400
        if (user === undefined) {
            res.status(400).send("Invalid credentials.");
        }
        //if there is a user match, add login cookie for 1 week and update last login
        else {
            //save email for local storage
            user.email = email;
            //set cookie to currentUser
            res.cookie("currentUser", JSON.stringify(user), {expires: new Date(Date.now() + ONE_WEEK)});
            //update last_login in database
            const updateQuery = "UPDATE users SET last_login = DATE('now') WHERE user_id = ?";
            await db.run(updateQuery, user["user_id"]);
            res.status(200).send("Logging in");
        }
        await db.close();
    } catch (error) {
        if (db !== null) {
            await db.close();
        }
        res.status(500).send("Server error.");
    }
});

/**
 * If the email already exists, display errors, otherwise add to database and log in
 */
app.post("/register", async (req, res) => {
    const email = req.body.email;
    const checkExistsQuery = "SELECT COUNT(*) FROM users WHERE user_email = ?";
    let db = null;
    try {
        db = await getDBConnection();
        const emailCount = await db.get(checkExistsQuery, [email]);
        console.log(emailCount);
        if (emailCount["COUNT(*)"] !== 0) {
            res.status(400).send("Email already exists.")
        } else {
            const password = req.body.password;
            const insertQuery = "INSERT INTO users (user_email, user_password, account_created, last_login) VALUES (?, ?, DATE('now'), DATE('now'))";
            const result = await db.run(insertQuery, [email, password]);
            if (result.changes === 1) {
                const user = {
                    user_id: result.lastID,
                    user_alias: null,
                    profile_picture: null,
                    email: email
                }
                res.cookie("currentUser", JSON.stringify(user), {expires: new Date(Date.now() + ONE_WEEK)});
                res.status(200).send("Registering");
            } else { //unable to insert
                res.status(500).send("Server error.");
            }
        }
        await db.close();
    } catch (error) {
        res.status(500).send("Server error.");
        if (db !== null) {
            await db.close();
        }
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("currentUser");
    res.sendStatus(200);
})


// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} else {
    module.exports = app; // Export app for testing
}