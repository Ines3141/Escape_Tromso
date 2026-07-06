/* QUESTIONS
- Do we need this: input.addEventListener("keydown", (event) =>)...
  Function is about what happens if a key from the keyboard is pressed...

THINGS TO DO:
- change it to an nicer interface, where one can enter the numbers
- (FIXED JØRGEN 7/6 26) When one presses on a cell, where one number is already there and one enters a new 
  number, the old number is automatically overwritten.
- Change the alert message in document.getElementById("callNansenBtn")
  with "Grid not solved." to another design/message on the webpage

THINGS TO CHANGE AT THE END:
- function isGridCorrect()
- Remove document.getElementById("devContinueBtn") 
*/

/* Correct anwer for the grid */
const correctGrid = [
    [9, 8, 2, 1],
    [2, 1, 9, 8],
    [1, 2, 8, 9],
    [8, 9, 1, 2]
];
const phoneCells = [
    [0, 0],
    [1, 2],
    [1, 3],
    [2, 0],
    [3, 1],
    [3, 3]
];
/* Path for Greenland */
const greenPath = [
    [0, 3],
    [1, 3],
    [2, 2],
    [0, 1]
];
/* Path for Nobel Peace */
const redPath = [
    [1, 1],
    [1, 2],
    [2, 1],
    [1, 0]
];
/* 
Explaination:
- phoneCells.map(([row, col]) => String(correctGrid[row][col])):
    Go through every [row, col] pair in phoneCells, 
    look up that cell in correctGrid, turn it into text, 
    and put it into a new array.
- join(""): 
    takes an array and turns it into one string
=> Creates the correct phone number 
*/
const correctPhone = phoneCells.map(([row, col]) => String(correctGrid[row][col])).join("");
const nextPage = "../stations/station_2.html";
const grid = document.getElementById("magicGrid");
/* Creates the grid automatically */
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
        /* Creates cell element (16xtimes)*/
        const wrap = document.createElement("div");
        wrap.className = "cell-wrap";
        const input = document.createElement("input");
        input.className = "magic-cell";
        input.maxLength = 1; /* Only one input possible */
        /* Stores the cell position in the HTML */



        input.dataset.row = row;
        input.dataset.col = col;

        /* Checks if this cell is one of the yellow phone - number cells.
        Changes the css with adding phone -> color change  */
        if (isCellInList(row, col, phoneCells)) {
            wrap.classList.add("phone");
        }

        /* Checks if green/red path and adds the small index numbers */
        const greenIndex = getCellIndex(row, col, greenPath);
        const redIndex = getCellIndex(row, col, redPath);

        if (greenIndex !== -1) {
            wrap.classList.add("green-path");
            wrap.appendChild(createBadge(greenIndex + 1, "green-order"));
        } else if (redIndex !== -1) {
            wrap.classList.add("red-path");
            wrap.appendChild(createBadge(redIndex + 1, "red-order"));
        }

        input.addEventListener("beforeinput", (event) => {
            if (event.inputType === "insertText") {
                event.preventDefault();

                const newValue = event.data;

                if (!/^[0-9]$/.test(newValue)) return;

                input.value = newValue;

                const allInputs = [...document.querySelectorAll(".magic-cell")];
                const currentIndex = allInputs.indexOf(input);

                if (allInputs[currentIndex + 1]) {
                    allInputs[currentIndex + 1].focus();
                }

                checkGrid();
            }
        });
        /* Runs when a key is pressed. NOT NECESSARY WITH A PHONE */
        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && input.value === "") {
                const allInputs = [...document.querySelectorAll(".magic-cell")];
                const currentIndex = allInputs.indexOf(input);
                if (allInputs[currentIndex - 1]) {
                    allInputs[currentIndex - 1].focus();
                }
            }
        });
        /* Implement the cells/ content cells into the grid */
        wrap.appendChild(input);
        grid.appendChild(wrap);
    }
}
function createBadge(number, className) {
    /*
    Helper function:
    When cell belongs to red/green path one needs to create a 
    small index number, which is badge.
    */
    const badge = document.createElement("span");
    badge.className = `order-badge ${className}`;
    badge.textContent = number;
    return badge;
}
function isCellInList(row, col, list) {
    /* Checks if the pos (row,col) is in the 2d array (eg. green_path) */
    return list.some(cell => cell[0] === row && cell[1] === col);
}
function getCellIndex(row, col, list) {
    /* Enter values for row, col and 2d array like green path.
    It just look at the index where one can find row and col 
    in the 2d array and returns that.*/
    return list.findIndex(cell => cell[0] === row && cell[1] === col);
}
function getGridValues() {
    const values = [];
    for (let row = 0; row < 4; row++) {
        values[row] = [];
        for (let col = 0; col < 4; col++) {
            const input = document.querySelector(
                `.magic-cell[data-row="${row}"][data-col="${col}"]`);
            values[row][col] = input.value === "" ? null : Number(input.value);
        }
    }
    return values;
}
function checkGrid() {
    const values = getGridValues();
    if (values.flat().some(value => value === null)) return;
    let gridCorrect = true;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const input = document.querySelector(
                `.magic-cell[data-row="${row}"][data-col="${col}"]`
            );
            const correct = values[row][col] === correctGrid[row][col];
            input.classList.toggle("correct", correct);
            input.classList.toggle("wrong", !correct);
            if (!correct) gridCorrect = false;
        }
    }
    localStorage.setItem("nansenGridSolved", gridCorrect ? "true" : "false");
}
document.getElementById("callNansenBtn").onclick = () => {
    /* Check if the grid is correct solved, not activated yet, if not
    one has to solve it all the time. Later fix isGridCorrect */
    if (!isGridCorrect()) {
        alert("The grid is not solved yet.");
        return;
    }
    document.getElementById("phoneOverlay")
        .classList.remove("hidden");
};
document.getElementById("closePhone").onclick = () => {
    document.getElementById("phoneOverlay").classList.add("hidden");
};
document.getElementById("callBtn").onclick = () => {
    /* Checks if the phone numer is correct and goes to the next page if yes. */
    const value = document.getElementById("phoneInput").value.trim();
    const message = document.getElementById("phoneMessage");
    if (value === correctPhone) {
        message.textContent = "Calling Nansen...";
        message.style.color = "lightgreen";
        setTimeout(() => {
            window.location.href = nextPage;
        }, 1000);
    } else {
        message.textContent = "Wrong number.";
        message.style.color = "#ff6b6b";
        setTimeout(() => { /* Close layover */
            document.getElementById("phoneOverlay").classList.add("hidden");
            message.textContent = "";
            document.getElementById("phoneInput").value = "";
        }, 1200);
    }
};
function isGridCorrect() {
    const values = getGridValues();
    /* USE LATER THIS:
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (values[row][col] !== correctGrid[row][col]) {
                return false;
            }
        }
    }*/
    return true;
}

/* DEVELOPMENT ONLY - remove before release */
document.getElementById("devContinueBtn").onclick = () => {
    window.location.href = nextPage;
};