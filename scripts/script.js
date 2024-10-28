
// Author: Rory Hackney
// This is the JavaScript script for the Add New page of my Art Supply Tracker.
// It handles form validation, event listeners, and fetching/displaying colors from the API as needed.

"use strict";
(function () {
    /** The currently selected Color Family option*/
    let currentOption;

    //TODO: IMPLEMENT CACHE
    /** Saves API data so it doesn't need to be fetched again */
    let cache = {};

    window.addEventListener("load", init);

    /**
     * Initializes event listeners and other setup on the page
     */
    function init() {
        document.getElementsByTagName("form")[0].addEventListener("submit", (event) => {validate(event)});
        document.getElementById("color-family").addEventListener("change", selectOption);
        document.getElementById("display-colors").addEventListener("click", (event) => {selectColor(event)});
        currentOption = document.getElementById("no-option");
    }
    
    /**
     * When #color-family select is changed, updates selected option and fetches family's colors
     */
    async function selectOption() {
        currentOption.classList.remove("selected");
        const FAMILY = this.value;
        
        removeColors();
        
        if (FAMILY == "") {
            currentOption = document.getElementById("no-option");
            changePlaceholder("Choose a color family", "");
        } else {
            currentOption = document.getElementById(FAMILY);
            changePlaceholder("Loading...", "");
            
            // console.log("cache:", cache);
            if (cache.hasOwnProperty(FAMILY)) {
                // console.log("fetching from cache");
                displayColors(cache[FAMILY]);
            } else {
                //fetch here
                await fetchColors(FAMILY);
            }
        }
        currentOption.classList.add("selected");
    }

    /**
     * Changes the placeholder text and value for #color select option
     * @param {string} placeholder - text message placeholder, will be displayed 
     * @param {string} value - value of the select option, empty string is nonsubmittable
     */
    function changePlaceholder(placeholder, value) {
        const OPTION = document.getElementById("no-color")
        OPTION.innerText = placeholder;
        OPTION.value = value;
    }
    
    /**
     * Removes color options from the display div
     */
    function removeColors() {
        const DIV = document.getElementById("display-colors");
        while (DIV.lastChild) {
            DIV.removeChild(DIV.lastChild);
        }
    }
    
    /**
     * Displays each color as a button inside the #display-colors div
     * @param {string[]} colors - array of CSS color names
     */
    function displayColors(colors) {
        const DIV = document.getElementById("display-colors");
        colors.forEach(color => {
            let button = document.createElement("button");
            button.innerText = color;
            button.type = "button";
            
            let span = document.createElement("span");
            span.style.backgroundColor = color;
            button.appendChild(span);
            
            DIV.appendChild(button);
        });
    }

    /**
     * Event handler which updates the selected color to the color that was clicked
     * @param {Event} event - click event 
     */
    function selectColor(event) {
        const TAG = event.target.tagName;
        if (TAG != "DIV") {
            //default for button click
            let color = event.target.innerText;
            if (TAG == "SPAN") {
                color = event.target.parentNode.innerText;
            }
            changePlaceholder(color, color);
        }
    }
    
    /**
     * Parses the JSON returned from the fetch call and returns the color names or throws an error
     * @param {string} json - valid JSON returned from the fetch call 
     * @returns array of CSS color names from the family
     */
    function handleJSON(json) {
        if (json.status == 200 && json.statusText == "OK") {
            let colors = [];
            for (let index = 0; index < json.count; index++) {
                let current = json.colors[index];
                colors.push(current.name);
            }
            changePlaceholder("Pick a color", "");
            return colors;
        } else {
            throw Error(json.statusText);
        }
    }

    /**
     * Checks a response to ensure the status is ok
     * @param {Response} response 
     * @returns validated response
     */
    function statusCheck(response) {
        if (response.status == 404) {throw new Error("Invalid API path");}
        if (! response.ok) throw new Error(response.message);
        return response;
    }

    /**
     * Handles the error by displaying it in the Color select display
     * @param {Error} error - error object to be displayed
     */
    function handleError(error) {
        changePlaceholder("Error: " + error.message, "");
    }
    
    /**
     * Fetches and displays all colors from the colorFamily
     * @param {string} colorFamily: should be one of the select options
     */
    async function fetchColors(colorFamily) {
        // console.log("fetching from api");
        fetch("https://www.csscolorsapi.com/api/colors/group/" + colorFamily)
        .then((response) => statusCheck(response))
        .then((response) => response.json())
        .then((json) => handleJSON(json))
        .then((colors) => {
            cache[colorFamily] = colors;
            displayColors(colors);
        })
        .catch((error) => handleError(error));
    }

    /**
     * Handles the form submission, validating fields and only submitting when there are no errors
     * @param {Event} event - the submit event
     */
    async function validate(event) {
        let errors = false;

        let desc = validateDescription();
        let qty = validateQuantity();
        let fam = validateColorFamily();
        let col = validateColor();

        errors = await desc || await qty || await fam || await col;
        // console.log(errors);
        if (errors) {
            event.preventDefault();
        }
    }

    /**
     * Validates the description field for empty/blank values
     * @returns whether the description field contains errors
     */
    async function validateDescription() {
        const DESC_ERR = document.getElementById("description-error");
        if (document.getElementById("description").value.trim() === "") {
            DESC_ERR.innerText = "Description is required";
            return true;
        } else {
            DESC_ERR.innerText = "";
            return false;
        }
    }

    /**
     * Validates the quantity field for nonblank input between 0-999
     * @returns whether the quantity field contains errors
     */
    async function validateQuantity() {
        const QTY_ERR = document.getElementById("quantity-error");
        const QTY = document.getElementById("quantity");
        if (QTY.value.trim() === "") {
            QTY_ERR.innerText = "Quantity is required";
            return true;
        } else if (QTY.value < 0) {
            QTY_ERR.innerText = "Quantity cannot be negative";
            return true;
        } else if (QTY.value > 999) {
            QTY_ERR.innerText = "Quantity must be less than 1000";
            return true;
        } else {
            QTY_ERR.innerText = "";
            return false;
        }
    }

    /**
     * Validates the Color Family select for a valid selection
     * @returns whether the Color Family selection is invalid
     */
    async function validateColorFamily() {
        const COLOR_FAM = document.getElementById("color-family");
        const COLOR_FAM_ERR = document.getElementById("color-family-error");
        if (COLOR_FAM.value === "") {
            COLOR_FAM_ERR.innerText = "Color Family is required";
            return true;
        } else {
            COLOR_FAM_ERR.innerText = "";
            return false;
        }
    }

    /**
     * Validates the Color select for a valid selection
     * @returns whether the Color selection is invalid
     */
    async function validateColor() {
        const COLOR_FAM = document.getElementById("color-family");
        const COLOR = document.getElementById("no-color");
        const COLOR_ERR = document.getElementById("color-error");
        if (COLOR_FAM.value === "") {
            COLOR_ERR.innerText = "Color is required. Pick a Family first.";
            return true;
        } else if (COLOR.value === "") {
            COLOR_ERR.innerText = "Color is required. Pick a color below.";
            return true;
        } else {
            COLOR_ERR.innerText = "";
            return false;
        }
    }
    
})();