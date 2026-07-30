"use strict";

/*
 * Page configuration
 * These variables remain global because navigation.js uses them.
 */
window.previousPage = "../stations/station_2_2.html";
window.nextPage = "riddle_2_4_location.html";

document.addEventListener("DOMContentLoaded", () => {
    const correctAnswer = "SLEIGH";
    const selectedButtons = [];

    const game = document.querySelector(".ice-game");
    const numberButtons = document.querySelectorAll(
        ".ice-game .number-dot"
    );

    const lineLayer = document.getElementById("lineLayer");
    const feedback = document.getElementById("feedback");
    const routeOutput = document.getElementById("selectedRoute");

    const checkButton = document.getElementById("check_nansen");
    const undoButton = document.getElementById("undo_nansen");
    const resetButton = document.getElementById("reset_nansen");
    const continueButton = document.getElementById("submit_nansen");

    if (
        !game ||
        !lineLayer ||
        !feedback ||
        !routeOutput ||
        !checkButton ||
        !undoButton ||
        !resetButton ||
        !continueButton
    ) {
        console.error("The Nansen riddle is missing required elements.");
        return;
    }

    /*
     * Set up the shared navigation after navigation.js has loaded.
     */
    if (typeof setupGameNavigation === "function") {
        setupGameNavigation();
    }

    numberButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectNumber(button);
        });
    });

    checkButton.addEventListener("click", checkAnswer);
    undoButton.addEventListener("click", undoLastSelection);
    resetButton.addEventListener("click", resetGame);

    continueButton.addEventListener("click", () => {
        window.location.href = window.nextPage;
    });

    window.addEventListener("resize", drawCurvedLines);

    /*
     * ResizeObserver redraws the route if the game box changes size.
     */
    if ("ResizeObserver" in window) {
        const resizeObserver = new ResizeObserver(drawCurvedLines);
        resizeObserver.observe(game);
    }

    function selectNumber(button) {
        if (
            selectedButtons.includes(button) ||
            game.classList.contains("solved")
        ) {
            return;
        }

        selectedButtons.push(button);
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

        clearFeedback();
        updateInterface();
    }

    function undoLastSelection() {
        const lastButton = selectedButtons.pop();

        if (!lastButton) {
            return;
        }

        lastButton.classList.remove("selected");
        lastButton.setAttribute("aria-pressed", "false");

        clearFeedback();
        updateInterface();
    }

    function checkAnswer() {
        const currentAnswer = selectedButtons
            .map((button) => button.dataset.number)
            .join("");

        if (currentAnswer === correctAnswer) {
            showSuccess();
            return;
        }

        showError();
    }

    function showSuccess() {
        feedback.textContent =
            "Correct! You found the safe route through the ice.";

        feedback.className = "riddle-feedback success";

        game.classList.add("solved");

        numberButtons.forEach((button) => {
            button.disabled = true;
        });

        checkButton.hidden = true;
        undoButton.disabled = true;
        resetButton.disabled = true;
        continueButton.hidden = false;
    }

    function showError() {
        feedback.textContent =
            "That route is not correct. Check the year and try again.";

        feedback.className = "riddle-feedback error";

        game.classList.remove("wrong-answer");

        /*
         * Restart the animation when several wrong attempts are made.
         */
        void game.offsetWidth;

        game.classList.add("wrong-answer");

        window.setTimeout(() => {
            game.classList.remove("wrong-answer");
        }, 400);
    }

    function resetGame() {
        selectedButtons.length = 0;

        numberButtons.forEach((button) => {
            button.classList.remove("selected");
            button.setAttribute("aria-pressed", "false");
            button.disabled = false;
        });

        game.classList.remove("solved", "wrong-answer");

        checkButton.hidden = false;
        continueButton.hidden = true;

        clearFeedback();
        updateInterface();
    }

    function clearFeedback() {
        feedback.textContent = "";
        feedback.className = "riddle-feedback";
    }

    function updateInterface() {
        updateRouteOutput();
        drawCurvedLines();

        const hasSelection = selectedButtons.length > 0;

        undoButton.disabled = !hasSelection;
        resetButton.disabled = !hasSelection;
    }

    function updateRouteOutput() {
        if (selectedButtons.length === 0) {
            routeOutput.textContent = "—";
            return;
        }

        routeOutput.textContent = selectedButtons
            .map((button) => button.dataset.number)
            .join(" → ");
    }

    function drawCurvedLines() {
        lineLayer.replaceChildren();

        if (selectedButtons.length < 2) {
            return;
        }

        for (let index = 0; index < selectedButtons.length - 1; index++) {
            const start = getCenter(selectedButtons[index]);
            const end = getCenter(selectedButtons[index + 1]);

            const horizontalDistance = Math.abs(end.x - start.x);
            const curveHeight = Math.min(
                55,
                Math.max(22, horizontalDistance * 0.15)
            );

            const middleX = (start.x + end.x) / 2;
            const middleY = (start.y + end.y) / 2 - curveHeight;

            const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

            path.setAttribute(
                "d",
                `M ${start.x} ${start.y}
                 Q ${middleX} ${middleY}
                 ${end.x} ${end.y}`
            );

            path.classList.add("route-line");
            lineLayer.appendChild(path);
        }
    }

    function getCenter(element) {
        const gameRectangle = game.getBoundingClientRect();
        const elementRectangle = element.getBoundingClientRect();

        return {
            x:
                elementRectangle.left +
                elementRectangle.width / 2 -
                gameRectangle.left,

            y:
                elementRectangle.top +
                elementRectangle.height / 2 -
                gameRectangle.top
        };
    }

    updateInterface();
});