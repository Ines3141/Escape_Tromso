document.addEventListener("DOMContentLoaded", () => {

    const pages =
        document.querySelectorAll(".page");

    const nextButton =
        document.querySelector(".page-corner");

    const previousButton =
        document.querySelector(".previous-corner");

    const paperclip =
        document.getElementById("paperclip");

    const stickyNote =
        document.getElementById("stickyNote");

    let currentPage = 0;
    let canTurnPage = false;

    function updatePages() {

        pages.forEach((page, index) => {
            if (index < currentPage) {
                page.classList.add("flipped");
            }
            else {
                page.classList.remove("flipped");
            }

            page.style.zIndex =
                pages.length -
                Math.abs(index - currentPage);

            if (!canTurnPage) {
                return; // stop here if page turning is locked
            }
        });

    }

    nextButton.addEventListener("click", () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePages();
        }
    });

    previousButton.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            updatePages();
        }
    });

    // Swipe support
    let startX = 0;
    document.querySelector(".book")
        .addEventListener("touchstart", (event) => {
            startX =
                event.changedTouches[0].clientX;
        });

    document.querySelector(".book")
        .addEventListener("touchend", (event) => {
            let endX =
                event.changedTouches[0].clientX;
            if (startX - endX > 60) {
                nextButton.click();
            }
            if (endX - startX > 60) {
                previousButton.click();
            }
        });

    updatePages();

    paperclip.addEventListener("click", function () {

        stickyNote.classList.add("hide");

        // Unlock page turning
        canTurnPage = true;


    });
});



// Sticky note functionality


