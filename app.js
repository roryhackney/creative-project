// Express / Node file that handles get/post routing and API routes,
// database connection and querying, authentication, etc
// Rory Hackney

const express = require('express'); 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //cookies
const axios = require('axios');
const multer = require('multer'); //post form handler
//db
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require("cors"); //to allow fetching

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//post form handlers
app.use(multer().none());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

//one week in milliseconds for timers, cookie expirations, etc
const ONE_WEEK = 604800000;
//the port this app connects to on localhost
const PORT = process.env.PORT || 8000;

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

/**
 * if the user is logged in, go to home, otherwise, go to about
 */
app.get('/', (req, res) => {
    goAboutIfLoggedOut(req, res);
    res.sendFile(__dirname + "/public/index.html")
});

//Stack Overflow says this needs to be declared after / route
// https://stackoverflow.com/questions/25166726/express-serves-index-html-even-when-my-routing-is-to-a-different-file
app.use(express.static('public'));

/**
 * @api {get} /about About Page
 * @apiName AboutPage
 * @apiGroup User
 * @apiDescription If the user is logged out, loads about page, else redirects
 */
app.get('/about', (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/about.html");
});

/**
 * @api {get} /login Login Page
 * @apiName LoginPage
 * @apiGroup User
 * @apiDescription If the user is logged out, loads login page, else redirects
 */
app.get("/login", (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/login.html");
});

/**
 * @api {get} /register Register Page
 * @apiName RegisterPage
 * @apiGroup User
 * @apiDescription If the user is logged out, loads registration page, else redirects
 */
app.get("/register", (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/register.html");
});


/**
 * @api {get} /reset-password Reset Password Page
 * @apiName ResetPasswordPage
 * @apiGroup User
 * @apiDescription If the user is logged out, loads reset password page, else redirects
 */
app.get("/reset-password", (req, res) => {
    goHomeIfLoggedIn(req, res);
    res.sendFile(__dirname + "/public/reset.html");
});

/**
 * @api {get} /customize Customize Settings Page
 * @apiName CustomizePage
 * @apiGroup User
 * @apiDescription If the user is logged in, loads customize page, else redirects
 */
app.get("/customize", (req, res) => {
    goAboutIfLoggedOut(req, res);
    res.sendFile(__dirname + "/public/customize.html");
});

/**
 * @api {get} /add-new Add New Art Supply Page
 * @apiName AddNewPage
 * @apiGroup User
 * @apiDescription If the user is logged in, loads add new supply page, else redirects
 */
app.get("/add-new", (req, res) => {
    goAboutIfLoggedOut(req, res);
    res.sendFile(__dirname + "/public/add-new.html");
});

/**
 * @api {post} /login Login
 * @apiName Login
 * @apiGroup User
 * @apiDescription Logs in if credentials are found in database, else returns errors
 * @apiSuccessExample {text} Success-Response:
 *     HTTP/1.1 200 OK
 *     "Logging in"
 * @apiErrorExample {text} Bad Credentials:
 *     HTTP/1.1 400 Bad Request
 *     "Invalid credentials."
 * @apiErrorExample {text} Server Error:
 *     HTTP/1.1 500 Internal Server Error
 *     "Server error."
 */
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
 * @api {post} /register Register User Account
 * @apiName Register
 * @apiGroup User
 * @apiDescription If the email is not registered already, registers user in database and logs in, else error
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 * @apiErrorExample Email Exists:
 *     HTTP/1.1 400 Bad Request
 * @apiErrorExample Server Error:
 *     HTTP/1.1 500 Internal Server Error
 */
app.post("/register", async (req, res) => {
    const email = req.body.email;
    const checkExistsQuery = "SELECT COUNT(*) FROM users WHERE user_email = ?";
    let db = null;
    try {
        db = await getDBConnection();
        const emailCount = await db.get(checkExistsQuery, [email]);
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

/**
 * @api {post} /logout Logout
 * @apiName Logout
 * @apiGroup User
 * @apiDescription Logs out the current user
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
app.get("/logout", (req, res) => {
    res.clearCookie("currentUser");
    res.sendStatus(200);
})

/**
 * @api {post} /display-art-supplies Request User Art Supplies
 * @apiName DisplayArtSupplies
 * @apiGroup User
 * @apiDescription If the user is logged in, sends their art supplies as JSON, otherwise fails
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *      {
 *       "category": "Painting",
 *       "type": "Brush",
 *       "brand": "Winsor & Newton",
 *       "quantity": 1,
 *       "onWishlist": true,
 *       "location": "Closet bottom shelf"
 *      },
 *      {...}
 *     ]
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 */
app.post("/display-art-supplies", async (req, res) => {
    goAboutIfLoggedOut(req, res);
    const selectQuery = `SELECT category_name AS category
                , supply_type_name AS type
                , art_supplies.art_supply_name AS name, art_supplies.brand_name AS brand
                , user_supplies.quantity, user_supplies.onWishlist, user_supplies.storageLocation AS location 
                FROM user_supplies
                INNER JOIN art_supplies ON user_supplies.supply_id = art_supplies.art_supply_id 
                INNER JOIN supply_types ON art_supplies.art_supply_type = supply_types.supply_type_id 
                INNER JOIN user_supply_types ON supply_types.supply_type_id = user_supply_types.supply_type_id 
                INNER JOIN user_categories ON user_supply_types.parent_category = user_categories.id 
                INNER JOIN categories ON user_categories.category_id = categories.category_id 
                WHERE user_supplies.user_id = ? 
                ORDER BY category_name`;
    let db = null;
    try {
        db = await getDBConnection();
        const userId = JSON.parse(req.cookies["currentUser"]).user_id;
        const results = await db.all(selectQuery, userId);
        await db.close();
        res.status(200);
        res.json(results);
    } catch (error) {
        if (db !== null) await db.close();
        res.status(500);
    }
});

/**
 * @api {post} /get-user-profile Request User information
 * @apiName GetUserProfile
 * @apiGroup User
 * @apiDescription If the user is logged in, sends profile information, otherwise fails
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "currentUser": {
 *           "user_id": 99,
 *           "user_alias": "Cool Gal",
 *           "profile_picture": null,
 *           "email": "coolgal@coolemails.com"
 *       }
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "currentUser": null
 *     }
 */
app.post("/get-user-profile", (req, res) => {
    if (req.cookies["currentUser"]) {
        res.status(200).json({"currentUser": JSON.parse(req.cookies["currentUser"])});
    } else {
        res.status(401).json({"currentUser": null});
    }
})

// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} else {
    module.exports = app; // Export app for testing
}