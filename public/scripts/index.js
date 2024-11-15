//Rory Hackney
//This file handles displaying the art supplies of the user who is logged in on the home page

"use strict";
(function () {
    window.addEventListener("load", init);

    function init() {
        //handle form sorting list etc
        initialDisplay();
    }

    function statusCheck(response) {
        if (! response.ok) throw new Error(response.message);
        return response;
    }
    
    function initialDisplay() {
        fetch("/display-art-supplies", {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then((res) => statusCheck(res))
        .then(async (res) => await res.json())
        .then((res) => {
            const displayDiv = document.getElementById("list-art-supplies"); 
            //if there are no items, display a message saying so
            if (res.length == 0) {
                const p = document.createElement("p");
                p.innerText = "Looks like you don't have any art supplies yet.";
                displayDiv.appendChild(p);
            }
            //if there are items, display them in a table
            else {
                const table = document.createElement("table");
                //create a row of the heading labels
                const labels = document.createElement("tr");
                for (const key in res[0]) {
                    const heading = document.createElement("th");
                    heading.innerText = key;
                    labels.appendChild(heading);
                }
                table.appendChild(labels);

                //for each item, create a row of values
                res.forEach(artSupply => {
                    const row = document.createElement("tr");
                    for (const key in artSupply) {
                        const cell = document.createElement("td");
                        cell.innerText = artSupply[key];
                        row.appendChild(cell);
                    };
                    table.appendChild(row);
                });
                displayDiv.append(table);
            }
        })
        .catch((err) => {
            const error = document.createElement("span");
            error.id = "error";
            error.innerText = err;
            // error.innerText = "Something went wrong. Please try again later.";
            document.getElementById("list-art-supplies").appendChild(error);
        });
    }

})();