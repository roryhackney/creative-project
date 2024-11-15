//Rory Hackney
//This file handles fetching user profile data and displaying it in the customize account page

"use strict";
(function () {
    window.addEventListener("load", init);

    function statusCheck(response) {
        if (! response.ok) throw new Error(response.message);
        return response;
    }

    function init() {
        fetch("/get-user-profile", {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then((res) => statusCheck(res))
        .then((res) => res.json())
        .then((res) => {
            const user = res.currentUser;
            if (user.alias !== null) {
                document.getElementById("alias").value = user.user_alias;
            }
            document.getElementById("email").value = user.email;
        }).catch((err) => {
            const error = document.createElement("span");
            error.className = "error";
            error.innerText = "Unable to load user data. Please try again later.";
            document.querySelector("form").appendChild(error);
        })
    }
})();