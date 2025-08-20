// document.addEventListener("DOMContentLoaded", () => {
//     const tabs = document.querySelectorAll(".tab__link");
//     const contents = document.querySelectorAll(".tab__content");

//     // Set initial active tab (e.g., first tab)
//     tabs[0].classList.add("tab__link--active");
//     contents[0].classList.add("tab__content--active");

//     tabs.forEach((tab) => {
//         tab.addEventListener("click", (e) => {
//             e.preventDefault(); // Prevent default anchor behavior

//             // Remove active class from all tabs and contents
//             tabs.forEach((t) => t.classList.remove("tab__link--active"));
//             contents.forEach((c) => c.classList.remove("tab__content--active"));

//             // Add active class to clicked tab and corresponding content
//             tab.classList.add("tab__link--active");
//             const contentId = tab.getAttribute("href"); // e.g., "tab1"
//             document
//                 .getElementById(contentId)
//                 .classList.add("tab__content--active");
//         });
//     });
// });

function Tabvid(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`Tabvid: no container found for selector"${selector}"`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`Tabvid: no tabs found inside the container`);
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tabvid: no panel found for selector"${tab.getAttribute(
                        "href"
                    )}"`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.tabs.length !== this.panels.length) return;

    this._init();
}

Tabvid.prototype._init = function () {
    const tabActive = this.tabs[0];
    tabActive.closest("li").classList.add("tabvid--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => this._handelTabClick(event, tab);
    });

    const panelActive = this.panels[0];
    panelActive.hidden = false;
};

Tabvid.prototype._handelTabClick = function (event, tab) {
    event.preventDefault();

    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabvid--active");
    });

    tab.closest("li").classList.add("tabvid--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;
};
