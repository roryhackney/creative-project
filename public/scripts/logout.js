//Rory Hackney
//This file handles adding the logout functionality to the logout button

"use strict";
(function () {
    window.addEventListener("load", init);

    function init() {
        const logout = document.getElementById("logout-button");
        if (logout !== null) {
            logout.addEventListener("click", (event) => {
                event.preventDefault();
                fetch("/logout")
                .then(() => window.location.replace("/about"));
            })
        }
    }
})();