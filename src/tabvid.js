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

function Tabvid(selector, options = {}) {
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

    this.panels = this.getPanels();

    if (this.tabs.length !== this.panels.length) return;

    this.opt = Object.assign(
        {
            activeClassName: "tabvid--active",
            remember: false,
            onChange: null,
        },
        options
    );

    this._cleanRegex = /[^a-zA-Z0-9]/g;
    this.parmaKey = selector.replace(this._cleanRegex, "");
    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tabvid.prototype.getPanels = function () {
    return this.tabs
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
};

Tabvid.prototype._init = function () {
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this.parmaKey);
    const tab =
        (this.opt.remember &&
            tabSelector &&
            this.tabs.find(
                (tab) =>
                    tab.getAttribute("href").replace(this._cleanRegex, "") ===
                    tabSelector
            )) ||
        this.tabs[0];

    this.currentTab = tab;
    this._activateTab(tab, false);

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            event.preventDefault();
            this._tryActivateTab(tab);
        };
    });
};

Tabvid.prototype._tryActivateTab = function (tab) {
    if (this.currentTab !== tab) {
        this._activateTab(tab);
        this.currentTab = tab;
    }
};

Tabvid.prototype._activateTab = function (tab, triggerOnChange = true) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove(this.opt.activeClassName);
    });

    tab.closest("li").classList.add(this.opt.activeClassName);

    this.panels.forEach((panel) => (panel.hidden = true));

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (this.opt.remember) {
        const params = new URLSearchParams(location.search);
        params.set(
            this.parmaKey,
            tab.getAttribute("href").replace(this._cleanRegex, "")
        );
        history.replaceState(null, null, `?${params}`);
    }

    if (triggerOnChange && typeof this.opt.onChange === "function") {
        this.opt.onChange({
            tab,
            panel: panelActive,
        });
    }
};

Tabvid.prototype.switch = function (input) {
    const tab =
        typeof input === "string"
            ? this.tabs.find((tab) => tab.getAttribute("href") === input)
            : this.tabs.includes(input)
            ? input
            : null;

    if (!tab) {
        console.error(`Tabvid: Invalid input "${input}"`);
        return;
    }

    this._tryActivateTab(tab);
};

Tabvid.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => (panel.hidden = false));
    this.container = null;
    this.tabs = null;
    this.panels = null;
    this.currentTab = null;
};
