# Art Supply Tracker API
## About Page
If the user is logged out, loads about page, else redirects


GET <code>/about</code>

## Add New Art Supply Page
If the user is logged in, loads add new art supply page, else redirects

GET <code>/add-new</code>

## Customize Page
If the user is logged in, loads customize page, else redirects

GET <code>/login</code>

## Login (Text)
Logs in if request body credentials are found in database, else returns errors

POST <code>/login</code>
### Success Reponse
<code>HTTP/1.1 200 OK

"Logging in"</code>
### Bad Credentials
<code>HTTP/1.1 400 Bad Request

"Invalid credentials."</code>
### Server Error
<code>HTTP/1.1 500 Internal Server Error

"Server error."</code>

## Logout
Logs out the current user

POST <code>/logout</code>
### Success Response
<code>HTTP/1.1 200 OK</code>

## Register Page
If the user is logged out, loads registration page, else redirects

GET <code>/register</code>

## Register User Account
If the email is not registered already, registers user in database and logs in, else error

POST <code>/register</code>

### Success Response
<code>HTTP/1.1 200 OK</code>

### Email Exists
<code>HTTP/1.1 400 Bad Request</code>

### Server Error
<code>HTTP/1.1 500 Internal Server Error</code>

## Request Art Supplies (JSON)
If the user is logged in, sends their art supplies as JSON, otherwise fails

POST <code>/display-art-supplies</code>

### Success Response (JSON)
<code>HTTP/1.1 200 OK
[
 {
  "category": "Painting",
  "type": "Brush",
  "brand": "Winsor & Newton",
  "quantity": 1,
  "onWishlist": true,
  "location": "Closet bottom shelf"
 },
 {...}
]</code>

### Error Response
<code>HTTP/1.1 500 Internal Server Error</code>

## Request User Profile (JSON)
If the user is logged in, sends profile information, otherwise fails

POST <code>/get-user-profile</code>

### Success Response
<code>HTTP/1.1 200 OK
{
  "currentUser": {
      "user_id": 99,
      "user_alias": "Cool Gal",
      "profile_picture": null,
      "email": "coolgal@coolemails.com"
  }
}</code>

### Error Response
<code>HTTP/1.1 401 Unauthorized
{
  "currentUser": null
}</code>

## Reset Password Page
If the user is logged out, loads reset password page, else redirects

GET <code>/reset-password</code>