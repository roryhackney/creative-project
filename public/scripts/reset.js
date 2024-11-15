//Rory Hackney
//This file handles resetting the user's password on request

"use strict";
(function() {
    window.addEventListener("load", init);

    function init() {
        const FORM = document.querySelector("form");
        FORM.addEventListener("submit", (event) => {handleSubmit(event)});
    }

    function handleSubmit(event) {
        event.preventDefault();
        let span = document.querySelector("form span");
        span.innerText = "Just kidding, you can't reset your password. Try again later, " +
        "maybe I'll implement this eventually.";
    }
})();