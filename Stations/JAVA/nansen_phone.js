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
const grid = document.getElementById("magicGrid");

const phoneOverlay =
    document.getElementById("phoneOverlay");

const closePhoneButton =
    document.getElementById("closePhone");

const callButton =
    document.getElementById("callBtn");

const phoneInput =
    document.getElementById("phoneInput");

const phoneMessage =
    document.getElementById("phoneMessage");

const clearPhoneButton =
    document.getElementById("clearPhoneBtn");

const phoneDigits = Array.from(
    document.querySelectorAll(".phone-digit")
);
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
function updatePhoneInput() {
    phoneInput.value = phoneDigits
        .map(input => input.value)
        .join("");
}

function clearPhoneNumber() {
    phoneDigits.forEach(input => {
        input.value = "";

        input.classList.remove(
            "filled",
            "wrong"
        );
    });

    phoneInput.value = "";

    phoneMessage.textContent = "";
    phoneMessage.className = "";

    phoneDigits[0]?.focus();
}

function openPhoneOverlay() {
    phoneOverlay.classList.remove("hidden");

    phoneMessage.textContent = "";
    phoneMessage.className = "";

    window.setTimeout(() => {
        const firstEmptyInput =
            phoneDigits.find(input => !input.value);

        firstEmptyInput?.focus();
    }, 50);
}

function closePhoneOverlay() {
    phoneOverlay.classList.add("hidden");

    phoneMessage.textContent = "";
    phoneMessage.className = "";
}

phoneDigits.forEach((input, index) => {
    input.addEventListener("input", () => {
        /*
         * Allow only one numeric digit.
         */
        input.value = input.value
            .replace(/\D/g, "")
            .slice(0, 1);

        input.classList.toggle(
            "filled",
            input.value !== ""
        );

        input.classList.remove("wrong");

        phoneMessage.textContent = "";
        phoneMessage.className = "";

        updatePhoneInput();

        /*
         * Move to the next field automatically.
         */
        if (
            input.value &&
            index < phoneDigits.length - 1
        ) {
            phoneDigits[index + 1].focus();
        }
    });

    input.addEventListener("keydown", event => {
        /*
         * Move to the previous field when deleting
         * from an empty field.
         */
        if (
            event.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {
            phoneDigits[index - 1].focus();
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            phoneDigits[index - 1].focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < phoneDigits.length - 1
        ) {
            phoneDigits[index + 1].focus();
        }

        if (event.key === "Enter") {
            callButton.click();
        }
    });

    input.addEventListener("paste", event => {
        const pastedNumber =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

        if (!pastedNumber) {
            return;
        }

        event.preventDefault();

        phoneDigits.forEach(
            (digitInput, digitIndex) => {
                digitInput.value =
                    pastedNumber[digitIndex] || "";

                digitInput.classList.toggle(
                    "filled",
                    digitInput.value !== ""
                );

                digitInput.classList.remove("wrong");
            }
        );

        updatePhoneInput();

        const nextEmptyInput =
            phoneDigits.find(input => !input.value);

        if (nextEmptyInput) {
            nextEmptyInput.focus();
        } else {
            phoneDigits.at(-1)?.focus();
        }
    });
});
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
document
    .getElementById("callNansenBtn")
    .addEventListener("click", () => {
        if (!isGridCorrect()) {
            /*
             * Replace this alert later with an
             * on-page message if desired.
             */
            alert("The grid is not solved yet.");
            return;
        }

        openPhoneOverlay();
    });

closePhoneButton.addEventListener(
    "click",
    closePhoneOverlay
);

clearPhoneButton.addEventListener(
    "click",
    clearPhoneNumber
);

callButton.addEventListener("click", () => {
    updatePhoneInput();

    const value = phoneInput.value.trim();

    phoneDigits.forEach(input => {
        input.classList.remove("wrong");
    });

    if (value.length !== 6) {
        phoneMessage.textContent =
            "Please enter all six digits.";

        phoneMessage.className = "error";

        const firstEmptyInput =
            phoneDigits.find(input => !input.value);

        firstEmptyInput?.focus();
        return;
    }

    if (value !== correctPhone) {
        phoneMessage.textContent =
            "That number does not connect. Check the yellow fields again.";

        phoneMessage.className = "error";

        phoneDigits.forEach(input => {
            input.classList.add("wrong");
        });

        return;
    }

    phoneMessage.textContent =
        "Calling Fridtjof Nansen…";

    phoneMessage.className = "success";

    callButton.disabled = true;

    window.setTimeout(() => {
        window.location.href = nextPage;
    }, 1000);
});

/* Clear button */
document.getElementById("clearGridBtn").addEventListener("click", () => {
    document.querySelectorAll(".magic-cell").forEach(cell => {
        cell.value = "";
        cell.classList.remove("correct", "wrong");
    });
});
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

phoneOverlay.addEventListener("click", event => {
    if (event.target === phoneOverlay) {
        closePhoneOverlay();
    }
});

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        !phoneOverlay.classList.contains("hidden")
    ) {
        closePhoneOverlay();
    }
}); 
