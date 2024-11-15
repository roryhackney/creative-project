//Rory Hackney
//This file handles authenticating users who have filled out either the login or registration form, including form validation and fetching of backend database routes.
"use strict";

(function() {
    window.addEventListener("load", init);

    /**
     * Set up login/register form event listener on page load
     */
    function init() {
        if (document.querySelector("form").id == "login-form") {
            addListener(login);
        } else { //register form
            addListener(register);
        }
    }

    /**
     * Adds the provided function to the form button after validation
     * @param {*} func 
     */
    function addListener(func) {
        const button = document.querySelector("form button");
        button.addEventListener("click", (event) => {
            if (validateForm()) {
                func(event);
            } else {
                event.preventDefault();
            }
        });
    }

    /**
     * Validates the form and displays error messages
     * @returns Whether all form input is valid
     */
    function validateForm() {
        let errors = 0;
        //email field must be a valid email x@y.z
        const email = document.getElementById("email");
        const emailErr = document.getElementById("email-error");
        const emailPattern = /.+@.+\..+/;
        if (! emailPattern.test(email.value)) {
            emailErr.innerText = "Please enter a valid email address";
            errors++;
        } else {
            emailErr.innerText = "";
        }
        //password field cannot be empty
        const password = document.getElementById("password");
        const passErr = document.getElementById("password-error");
        if (password.value.length < 8) {
            passErr.innerText = "Password must be 8+ characters";
            errors++;
        } else {
            passErr.innerText = "";
        }
        return errors == 0;
    }

    /**
     * If the login fails, throw an error with the reason from the response
     */
    async function statusCheck(response) {
        if (! response.ok) throw new Error(await response.text());
        return response;
    }

    /**
     * When login is submitted, fetches /login POST and displays any errors
     * @param submit form event 
     */
    function login(event) {
        //post route will return 400 if bad login, 500 if other error
        //statusCheck should in that case throw an error
        //if the route doesn't throw an error, go home
        //catch and display the error message from the response
        event.preventDefault();
        //fetch the login route
        fetch("/login", {
            method: "POST",
            body: JSON.stringify({
                "email": document.getElementById("email").value,
                "password": document.getElementById("password").value
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(async (res) => await statusCheck(res))
        .then(() => {
            window.location.replace("/");
        })
        .catch((err) => {
            displayError(document.getElementById("email-error"), err.message, "/register", "register");
            displayError(document.getElementById("password-error"), err.message, "/reset", "reset your password");
        });
    }

    /**
     * Removes all children of a html node
     * @param parent the parent node to clear 
     */
    function clearChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
    }

    function displayError(parent, message, link, linkText) {
        //clear parent children
        clearChildren(parent);

        //first half of message
        const mess = document.createElement("span");
        mess.innerText = message + " Would you like to ";
        parent.appendChild(mess);

        //link to options
        const aLink = document.createElement("a");
        aLink.href = link;
        aLink.innerText = linkText;
        parent.appendChild(aLink);

        //second half of message
        const age = document.createElement("span");
        age.innerText = "?";
        parent.appendChild(age);
    }

    function register(event) {
        event.preventDefault();
        fetch("/register", {
            method: "POST",
            body: JSON.stringify({
                "email": document.getElementById("email").value,
                "password": document.getElementById("password").value
            }),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(async (res) => await statusCheck(res))
        .then(() => window.location.replace("/"))
        .catch((err) => {
            displayError(document.getElementById("email-error"), err.message, "/login", "login");
        });
    }
})();