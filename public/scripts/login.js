"use strict";

(function() {
    window.addEventListener("load", init);

    function init() {
        document.querySelector("form button").addEventListener("click", (event) => login(event));
    }

    function login(event) {
        event.preventDefault();
        window.location.href = "add-new.html";
    }
})();