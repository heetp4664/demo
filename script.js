let currentUser = null;

const initialHistory = [
    {
        id: 1,
        url: "google.com",
        risk: 8,
        status: "Safe",
        https: true,
        date: "05 Sep 2026",
        time: "10:42 AM"
    },
    {
        id: 2,
        url: "github.com",
        risk: 12,
        status: "Safe",
        https: true,
        date: "05 Sep 2026",
        time: "10:18 AM"
    },
    {
        id: 3,
        url: "paypa1-secure-login.com",
        risk: 67,
        status: "Suspicious",
        https: true,
        date: "05 Sep 2026",
        time: "09:51 AM"
    },
    {
        id: 4,
        url: "secure-bank-login.xyz",
        risk: 94,
        status: "Fake",
        https: false,
        date: "04 Sep 2026",
        time: "09:10 AM"
    }
];

let scanHistory = initialHistory.map(item => ({ ...item }));
let nextHistoryId = 5;


// ================= LOGIN =================

function login() {

    const username =
        document.getElementById("username")
            .value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("password")
            .value
            .trim();

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    const accounts = {
        heet: {
            password: "1234",
            name: "Heet",
            role: "Administrator"
        },

        admin: {
            password: "admin123",
            name: "Admin",
            role: "Administrator"
        },

        user: {
            password: "user123",
            name: "Demo User",
            role: "User"
        }
    };

    if (
        !accounts[username] ||
        accounts[username].password !== password
    ) {
        alert("Invalid username or password.");
        return;
    }

    currentUser = accounts[username];

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("app")
        .classList.remove("hidden");

    document.getElementById("loggedUserName")
        .textContent = currentUser.name;

    document.getElementById("loggedUserRole")
        .textContent = currentUser.role;

    document.getElementById("userAvatar")
        .textContent =
        currentUser.name.charAt(0).toUpperCase();

    updateGreeting(currentUser.name);

    applyRoleAccess();

    updateHistoryTable();

    updateDashboardStats();

    showPage("dashboard");
}


// ================= ADMIN ACCESS =================

function isAdministrator() {
    return currentUser &&
        currentUser.role === "Administrator";
}

function applyRoleAccess() {

    const adminMenu =
        document.getElementById("adminMenu");

    if (adminMenu) {
        adminMenu.classList.remove("hidden");
    }
}


// ================= USER GREETING =================

function updateGreeting(name) {

    const hour = new Date().getHours();

    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
    }

    else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    }

    else if (hour >= 17 && hour < 21) {
        greeting = "Good evening";
    }

    else {
        greeting = "Good night";
    }

    document.getElementById("welcomeGreeting")
        .textContent =
        `${greeting}, ${name} 👋`;
}


// ================= ENTER KEY =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const username =
            document.getElementById("username");

        const password =
            document.getElementById("password");

        const quickURL =
            document.getElementById("quickURL");

        const scannerURL =
            document.getElementById("scannerURL");


        if (username) {

            username.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        password.focus();
                    }
                }
            );
        }


        if (password) {

            password.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        login();
                    }
                }
            );
        }


        if (quickURL) {

            quickURL.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        quickScan();
                    }
                }
            );
        }


        if (scannerURL) {

            scannerURL.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        analyzeWebsite();
                    }
                }
            );
        }


        setInterval(
            function () {

                const name =
                    document.getElementById(
                        "loggedUserName"
                    ).textContent;

                if (name) {
                    updateGreeting(name);
                }

            },
            60000
        );
    }
);


// ================= LOGOUT =================

function logout() {

    currentUser = null;

    document.getElementById("app")
        .classList.add("hidden");

    document.getElementById("loginPage")
        .classList.remove("hidden");

    document.getElementById("username")
        .value = "";

    document.getElementById("password")
        .value = "";
}


// ================= PAGE NAVIGATION =================

function showPage(pageId, clickedButton) {

    if (
        pageId === "admin" &&
        !isAdministrator()
    ) {

        document.querySelectorAll(".page")
            .forEach(
                page =>
                    page.classList.remove(
                        "active-page"
                    )
            );

        document.getElementById("admin")
            .classList.add("active-page");

        document.getElementById("adminContent")
            .classList.add("hidden");

        document.getElementById("adminDenied")
            .classList.remove("hidden");

        document.querySelectorAll(".menu-item")
            .forEach(
                item =>
                    item.classList.remove("active")
            );

        if (clickedButton) {
            clickedButton.classList.add("active");
        }

        updatePageTitle("admin");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }


    if (
        pageId === "admin" &&
        isAdministrator()
    ) {

        document.getElementById("adminDenied")
            .classList.add("hidden");

        document.getElementById("adminContent")
            .classList.remove("hidden");
    }


    const target =
        document.getElementById(pageId);

    if (!target) {
        return;
    }


    document.querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove(
                    "active-page"
                )
        );

    target.classList.add("active-page");


    document.querySelectorAll(".menu-item")
        .forEach(
            item =>
                item.classList.remove("active")
        );

    if (clickedButton) {
        clickedButton.classList.add("active");
    }


    updatePageTitle(pageId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showPageByName(pageId) {

    if (pageId === "admin") {

        showPage(
            "admin",
            document.getElementById("adminMenu")
        );

        return;
    }


    document.querySelectorAll(".menu-item")
        .forEach(
            button => {

                if (
                    button.textContent
                        .toLowerCase()
                        .includes(
                            pageId.toLowerCase()
                        )
                ) {

                    showPage(
                        pageId,
                        button
                    );
                }
            }
        );
}


function updatePageTitle(pageId) {

    const titles = {

        dashboard: "Dashboard",

        scanner: "Website Scanner",

        result: "Analysis Result",

        history: "Scan History",

        reports: "Reports",

        admin: "Admin Panel"
    };


    document.getElementById("pageHeading")
        .textContent =
        titles[pageId] || "Dashboard";


    document.getElementById("crumb")
        .textContent =
        titles[pageId] || "Dashboard";
}


// ================= SCANNER =================

function openScanner() {

    const buttons =
        document.querySelectorAll(
            ".menu-item"
        );

    buttons.forEach(
        button => {

            if (
                button.textContent
                    .includes(
                        "Website Scanner"
                    )
            ) {

                showPage(
                    "scanner",
                    button
                );
            }
        }
    );
}


// ================= QUICK SCAN =================

function quickScan() {

    const input =
        document.getElementById("quickURL")
            .value
            .trim();


    if (input === "") {

        alert(
            "Please enter a website URL."
        );

        return;
    }


    let url = input;


    if (!/^https?:\/\//i.test(url)) {

        url = "https://" + url;
    }


    let parsedURL;


    try {

        parsedURL = new URL(url);

    }

    catch (error) {

        alert(
            "Please enter a valid URL.\nExample: https://example.com"
        );

        return;
    }


    let risk = 10;

    const hostname =
        parsedURL.hostname.toLowerCase();

    const isHTTPS =
        parsedURL.protocol === "https:";


    if (!isHTTPS) {
        risk += 25;
    }


    if (url.length > 70) {
        risk += 15;
    }


    if (
        hostname.split(".").length > 3
    ) {
        risk += 12;
    }


    if (hostname.includes("-")) {
        risk += 8;
    }


    const suspiciousWords = [

        "login",

        "verify",

        "secure",

        "account",

        "update",

        "bank",

        "password",

        "confirm"
    ];


    suspiciousWords.forEach(
        word => {

            if (hostname.includes(word)) {

                risk += 7;
            }
        }
    );


    const ipPattern =
        /^(\d{1,3}\.){3}\d{1,3}$/;


    if (ipPattern.test(hostname)) {

        risk += 30;
    }


    risk = Math.min(risk, 100);


    let status;


    if (risk < 35) {

        status = "Safe";

    }

    else if (risk < 70) {

        status = "Suspicious";

    }

    else {

        status = "Fake";
    }


    const box =
        document.getElementById(
            "quickScanResult"
        );


    const badge =
        document.getElementById(
            "quickResultBadge"
        );


    document.getElementById("quickRisk")
        .textContent =
        risk + "%";


    document.getElementById("quickHTTPS")
        .textContent =
        isHTTPS
            ? "Secure"
            : "Not Secure";


    document.getElementById("quickDomain")
        .textContent =
        risk > 60
            ? "Suspicious"
            : "Normal";


    document.getElementById("quickPattern")
        .textContent =
        risk > 60
            ? "High Risk"
            : risk > 35
                ? "Medium Risk"
                : "Low Risk";


    badge.className = "badge";


    if (status === "Safe") {

        badge.classList.add("safe");

        badge.textContent = "Safe";


        document.getElementById(
            "quickResultTitle"
        ).textContent =
            "Website appears safe";


        document.getElementById(
            "quickRecommendation"
        ).textContent =
            "No major suspicious indicators were detected in this prototype scan.";
    }


    else if (status === "Suspicious") {

        badge.classList.add(
            "suspicious"
        );

        badge.textContent =
            "Suspicious";


        document.getElementById(
            "quickResultTitle"
        ).textContent =
            "Website requires caution";


        document.getElementById(
            "quickRecommendation"
        ).textContent =
            "Verify the domain, HTTPS status and website identity before entering personal information.";
    }


    else {

        badge.classList.add("fake");

        badge.textContent =
            "Fake / Phishing";


        document.getElementById(
            "quickResultTitle"
        ).textContent =
            "Potential phishing website detected";


        document.getElementById(
            "quickRecommendation"
        ).textContent =
            "Do not enter passwords, banking details or personal information.";
    }


    box.classList.remove("hidden");


    addScanToHistory(
        url,
        risk,
        status,
        isHTTPS
    );
}


// ================= PHISHGUARD AI BACKEND =================

const PHISHGUARD_API = "http://127.0.0.1:5000";

let lastAnalysisResult = null;


// ================= URL NORMALIZATION =================

function normalizeInputURL(value) {

    let url = String(value || "").trim();

    if (!url) {
        return "";
    }

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    return url;
}


// ================= BACKEND ANALYSIS =================

async function analyzeWithBackend(inputURL) {

    const url = normalizeInputURL(inputURL);

    if (!url) {
        throw new Error("Please enter a website URL.");
    }

    try {

        new URL(url);

    } catch (error) {

        throw new Error(
            "Please enter a valid URL.\nExample: https://example.com"
        );
    }


    const response = await fetch(
        PHISHGUARD_API + "/api/analyze",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url: url
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            "Backend returned HTTP " + response.status
        );
    }


    const data = await response.json();


    if (!data.success) {

        throw new Error(
            data.error ||
            "Website analysis failed."
        );
    }


    lastAnalysisResult = data;

    return data;
}


// ================= BUTTON LOADING =================

function setButtonLoading(button, loading, normalText) {

    if (!button) {
        return;
    }


    if (loading) {

        button.disabled = true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "Analyzing...";

    }

    else {

        button.disabled = false;

        button.textContent =
            normalText ||
            button.dataset.originalText ||
            "Analyze";
    }
}


// ================= STATUS UI =================

function getStatusUI(status) {

    const value =
        String(status || "").toUpperCase();


    if (value === "SAFE") {

        return {
            className: "safe",
            label: "Safe",
            title: "Website appears to be safe",
            recommendation:
                "The AI model detected a low phishing probability. Still verify the domain before sharing sensitive information."
        };
    }


    if (value === "SUSPICIOUS") {

        return {
            className: "suspicious",
            label: "Suspicious",
            title: "Website requires caution",
            recommendation:
                "The AI model detected suspicious characteristics. Verify the website carefully before entering personal information."
        };
    }


    return {
        className: "fake",
        label: "Fake / Phishing",
        title: "Potential phishing website detected",
        recommendation:
            "Do not enter passwords, banking details or personal information on this website."
    };
}


// ================= QUICK SCAN =================

async function quickScan() {

    const input =
        document.getElementById("quickURL");


    if (!input) {
        return;
    }


    const value =
        input.value.trim();


    if (!value) {

        alert(
            "Please enter a website URL."
        );

        return;
    }


    const button =
        document.querySelector(
            "#dashboard .main-btn"
        );


    setButtonLoading(
        button,
        true,
        "Quick Scan"
    );


    try {

        const data =
            await analyzeWithBackend(value);


        const risk =
            Number(data.risk_score) || 0;


        const status =
            String(
                data.status || "SAFE"
            ).toUpperCase();


        const finalURL =
            data.final_url ||
            normalizeInputURL(value);


        let isHTTPS = false;


        try {

            isHTTPS =
                new URL(finalURL)
                    .protocol === "https:";

        } catch (error) {

            isHTTPS = false;
        }


        const ui =
            getStatusUI(status);


        const riskElement =
            document.getElementById(
                "quickRisk"
            );


        const httpsElement =
            document.getElementById(
                "quickHTTPS"
            );


        const domainElement =
            document.getElementById(
                "quickDomain"
            );


        const patternElement =
            document.getElementById(
                "quickPattern"
            );


        const badge =
            document.getElementById(
                "quickResultBadge"
            );


        const title =
            document.getElementById(
                "quickResultTitle"
            );


        const recommendation =
            document.getElementById(
                "quickRecommendation"
            );


        if (riskElement) {

            riskElement.textContent =
                risk + "%";
        }


        if (httpsElement) {

            httpsElement.textContent =
                isHTTPS
                    ? "Secure"
                    : "Not Secure";
        }


        if (domainElement) {

            domainElement.textContent =
                data.domain ||
                "Unknown";
        }


        if (patternElement) {

            patternElement.textContent =
                status === "PHISHING"
                    ? "High Risk"
                    : status === "SUSPICIOUS"
                        ? "Medium Risk"
                        : "Low Risk";
        }


        if (badge) {

            badge.className =
                "badge " + ui.className;

            badge.textContent =
                ui.label;
        }


        if (title) {

            title.textContent =
                ui.title;
        }


        if (recommendation) {

            recommendation.textContent =
                ui.recommendation;
        }


        const resultBox =
            document.getElementById(
                "quickScanResult"
            );


        if (resultBox) {

            resultBox.classList.remove(
                "hidden"
            );
        }


        addScanToHistory(
            finalURL,
            risk,
            status === "PHISHING"
                ? "Fake"
                : status === "SUSPICIOUS"
                    ? "Suspicious"
                    : "Safe",
            isHTTPS
        );


        updateAIModelCard(data);

    }

    catch (error) {

        console.error(
            "PhishGuard backend error:",
            error
        );


        alert(
            "Unable to analyze website.\n\n" +
            error.message +
            "\n\nMake sure Flask backend is running on port 5000."
        );

    }

    finally {

        setButtonLoading(
            button,
            false,
            "Quick Scan"
        );
    }
}


// ================= FULL ANALYSIS =================

function openFullAnalysis() {

    const quickInput =
        document.getElementById(
            "quickURL"
        );


    const scannerInput =
        document.getElementById(
            "scannerURL"
        );


    if (!quickInput || !scannerInput) {
        return;
    }


    const value =
        quickInput.value.trim();


    if (!value) {
        return;
    }


    scannerInput.value =
        normalizeInputURL(value);


    analyzeWebsite();
}


// ================= WEBSITE SCANNER =================

async function analyzeWebsite() {

    const input =
        document.getElementById(
            "scannerURL"
        );


    if (!input) {
        return;
    }


    const value =
        input.value.trim();


    if (!value) {

        alert(
            "Please enter a website URL."
        );

        return;
    }


    const button =
        document.querySelector(
            "#scanner .main-btn"
        );


    setButtonLoading(
        button,
        true,
        "Analyze Website"
    );


    try {

        const data =
            await analyzeWithBackend(value);


        showResultFromBackend(
            data
        );


        const finalURL =
            data.final_url ||
            normalizeInputURL(value);


        let isHTTPS = false;


        try {

            isHTTPS =
                new URL(finalURL)
                    .protocol === "https:";

        } catch (error) {

            isHTTPS = false;
        }


        const historyStatus =
            String(
                data.status || ""
            ).toUpperCase();


        addScanToHistory(

            finalURL,

            Number(
                data.risk_score
            ) || 0,

            historyStatus === "PHISHING"
                ? "Fake"
                : historyStatus === "SUSPICIOUS"
                    ? "Suspicious"
                    : "Safe",

            isHTTPS
        );


        updateAIModelCard(data);

    }

    catch (error) {

        console.error(
            "Full scanner error:",
            error
        );


        alert(
            "Unable to analyze website.\n\n" +
            error.message +
            "\n\nMake sure Flask backend is running."
        );

    }

    finally {

        setButtonLoading(
            button,
            false,
            "Analyze Website"
        );
    }
}


// ================= BACKEND RESULT =================

function showResultFromBackend(data) {

    const risk =
        Number(data.risk_score) || 0;


    const status =
        String(
            data.status || "SAFE"
        ).toUpperCase();


    const finalURL =
        data.final_url ||
        data.url ||
        "";


    let isHTTPS = false;


    try {

        isHTTPS =
            new URL(finalURL)
                .protocol === "https:";

    } catch (error) {

        isHTTPS = false;
    }


    const ui =
        getStatusUI(status);


    document.querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove(
                    "active-page"
                )
        );


    const resultPage =
        document.getElementById(
            "result"
        );


    if (resultPage) {

        resultPage.classList.add(
            "active-page"
        );
    }


    updatePageTitle(
        "result"
    );


    const percent =
        document.getElementById(
            "resultPercent"
        );


    if (percent) {

        percent.textContent =
            risk + "%";
    }


    const resultCircle =
        document.getElementById(
            "resultCircle"
        );


    if (resultCircle) {

        resultCircle.style.setProperty(
            "--risk",
            risk
        );


        resultCircle.style.setProperty(
            "--risk-angle",
            (risk * 3.6) + "deg"
        );


        const riskColor =
            status === "SAFE"
                ? "var(--green)"
                : status === "SUSPICIOUS"
                    ? "var(--yellow)"
                    : "var(--red)";


        resultCircle.style.setProperty(
            "--risk-color",
            riskColor
        );
    }


    const resultURL =
        document.getElementById(
            "resultURL"
        );


    if (resultURL) {

        resultURL.textContent =
            finalURL;
    }


    const badge =
        document.getElementById(
            "resultBadge"
        );


    if (badge) {

        badge.className =
            "badge " + ui.className;

        badge.textContent =
            ui.label;
    }


    const title =
        document.getElementById(
            "resultTitle"
        );


    if (title) {

        title.textContent =
            ui.title;
    }


    const httpsResult =
        document.getElementById(
            "httpsResult"
        );


    if (httpsResult) {

        httpsResult.textContent =
            isHTTPS
                ? "Secure"
                : "Not Secure";
    }


    const domainResult =
        document.getElementById(
            "domainResult"
        );


    if (domainResult) {

        domainResult.textContent =
            data.domain ||
            "Unknown";
    }


    const urlResult =
        document.getElementById(
            "urlResult"
        );


    if (urlResult) {

        urlResult.textContent =
            status === "PHISHING"
                ? "High Risk"
                : status === "SUSPICIOUS"
                    ? "Medium Risk"
                    : "Low Risk";
    }


    const recommendation =
        document.getElementById(
            "recommendationText"
        );


    if (recommendation) {

        recommendation.textContent =
            ui.recommendation;
    }


    updateThreatIntelligence(
        finalURL,
        risk,
        status === "PHISHING"
            ? "Fake"
            : status === "SUSPICIOUS"
                ? "Suspicious"
                : "Safe",
        isHTTPS
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================= AI MODEL RESULT =================

function updateAIModelCard(data) {

    const statusElement =
        document.querySelector(
            ".ai-status"
        );


    const detailElement =
        document.querySelector(
            ".ai-detail"
        );


    if (!statusElement &&
        !detailElement) {

        return;
    }


    const status =
        String(
            data.status || "SAFE"
        ).toUpperCase();


    const phishing =
        Number(
            data.phishing_probability
        ) || 0;


    const benign =
        Number(
            data.benign_probability
        ) || 0;


    const model =
        data.model ||
        "PhishLang MobileBERT";


    if (statusElement) {

        statusElement.textContent =
            status === "PHISHING"
                ? "Phishing Detected"
                : status === "SUSPICIOUS"
                    ? "Suspicious Website"
                    : "Website Appears Safe";
    }


    if (detailElement) {

        detailElement.textContent =
            model +
            " | Phishing: " +
            phishing.toFixed(2) +
            "% | Benign: " +
            benign.toFixed(2) +
            "%";
    }
}


// ================= RESULT BACKWARD COMPATIBILITY =================

function showResult(
    url,
    risk,
    status,
    isHTTPS
) {

    const fakeData = {

        url: url,

        final_url: url,

        domain: safeHostname(url),

        risk_score: Number(risk) || 0,

        status:
            status === "Fake"
                ? "PHISHING"
                : status === "Suspicious"
                    ? "SUSPICIOUS"
                    : "SAFE",

        phishing_probability:
            Number(risk) || 0,

        benign_probability:
            100 - (
                Number(risk) || 0
            ),

        model:
            "PhishLang MobileBERT"
    };


    showResultFromBackend(
        fakeData
    );
}


// ================= HISTORY =================

function addScanToHistory(
    url,
    risk,
    status,
    https
) {

    scanHistory.unshift({

        id: nextHistoryId++,

        url: url,

        risk: risk,

        status: status,

        https: https,

        date:
            new Date()
                .toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                ),

        time:
            new Date()
                .toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )
    });


    updateHistoryTable();

    updateDashboardStats();
}


function updateHistoryTable() {

    const table =
        document.getElementById(
            "historyTable"
        );


    if (!table) {
        return;
    }


    if (!scanHistory.length) {

        table.innerHTML =
            '<tr><td colspan="6" class="empty-history">No scan history available.</td></tr>';

        return;
    }


    table.innerHTML =
        scanHistory
            .map(
                scan => {

                    const badgeClass =
                        scan.status === "Safe"
                            ? "safe"
                            : scan.status === "Suspicious"
                                ? "suspicious"
                                : "fake";


                    return `
                        <tr>
                            <td>
                                ${escapeHTML(scan.url)}
                            </td>

                            <td>
                                <span class="badge ${badgeClass}">
                                    ${scan.status}
                                </span>
                            </td>

                            <td>
                                ${scan.risk}%
                            </td>

                            <td>
                                ${scan.https
                                    ? "✓ Secure"
                                    : "✕ Not Secure"}
                            </td>

                            <td>
                                ${escapeHTML(scan.date)}

                                ${
                                    scan.time
                                        ? `<br><small>${escapeHTML(scan.time)}</small>`
                                        : ""
                                }
                            </td>

                            <td>
                                <button
                                    class="history-delete"
                                    onclick="deleteHistory(${scan.id})"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `;
                }
            )
            .join("");
}


function deleteHistory(id) {

    const scan =
        scanHistory.find(
            item =>
                item.id === id
        );


    if (!scan) {
        return;
    }


    if (
        !confirm(
            `Delete this scan history?\n\n${scan.url}`
        )
    ) {

        return;
    }


    scanHistory =
        scanHistory.filter(
            item =>
                item.id !== id
        );


    updateHistoryTable();

    updateDashboardStats();
}


// ================= DASHBOARD =================

function updateDashboardStats() {

    let safe = 0;

    let suspicious = 0;

    let fake = 0;


    scanHistory.forEach(
        scan => {

            if (scan.status === "Safe") {

                safe++;
            }

            else if (
                scan.status === "Suspicious"
            ) {

                suspicious++;
            }

            else {

                fake++;
            }
        }
    );


    const total =
        scanHistory.length;


    document.getElementById(
        "totalScans"
    ).textContent =
        total;


    document.getElementById(
        "safeCount"
    ).textContent =
        safe;


    document.getElementById(
        "suspiciousCount"
    ).textContent =
        suspicious;


    document.getElementById(
        "fakeCount"
    ).textContent =
        fake;


    const rows =
        document.querySelectorAll(
            "#dashboard .summary-row b"
        );


    if (rows.length >= 3) {

        rows[0].textContent =
            (
                total
                    ? (safe / total * 100)
                        .toFixed(1)
                    : "0.0"
            ) + "%";


        rows[1].textContent =
            (
                total
                    ? (suspicious / total * 100)
                        .toFixed(1)
                    : "0.0"
            ) + "%";


        rows[2].textContent =
            (
                total
                    ? (fake / total * 100)
                        .toFixed(1)
                    : "0.0"
            ) + "%";
    }


    updateRecentActivity();
}


function updateRecentActivity() {

    const table =
        document.getElementById(
            "recentTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML =
        scanHistory
            .slice(0, 3)
            .map(
                scan => {

                    const badgeClass =
                        scan.status === "Safe"
                            ? "safe"
                            : scan.status === "Suspicious"
                                ? "suspicious"
                                : "fake";


                    return `
                        <tr>
                            <td>
                                ${escapeHTML(scan.url)}
                            </td>

                            <td>
                                <span class="badge ${badgeClass}">
                                    ${scan.status}
                                </span>
                            </td>

                            <td>
                                ${scan.risk}%
                            </td>

                            <td>
                                ${escapeHTML(
                                    scan.time ||
                                    "Recently"
                                )}
                            </td>
                        </tr>
                    `;
                }
            )
            .join("");
}


// ================= SEARCH =================

function filterHistory() {

    const search =
        document.getElementById(
            "historySearch"
        )
        .value
        .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#historyTable tr"
        );


    rows.forEach(
        row => {

            const text =
                row.textContent
                    .toLowerCase();


            row.style.display =
                text.includes(search)
                    ? ""
                    : "none";
        }
    );
}


// ================= THREAT INTELLIGENCE =================

function updateThreatIntelligence(
    url,
    risk,
    status,
    isHTTPS
) {

    // Get the latest backend analysis result
    const data =
        window.lastAnalysisResult ||
        (typeof lastAnalysisResult !== "undefined"
            ? lastAnalysisResult
            : null);

    const ti =
        data?.threat_intelligence || {};

    const vt =
        ti.virustotal || {};

    const vtDomain =
        vt.domain || {};

    const vtIP =
        vt.ip || {};

    const abuse =
        ti.abuseipdb || {};


    // ================= RISK =================

    const riskScore =
        Number(
            data?.risk_score ??
            risk ??
            0
        );

    const phishingProbability =
        Number(
            data?.phishing_probability ??
            0
        );


    const tier =
        riskScore < 35
            ? "LOW"
            : riskScore < 70
                ? "MODERATE"
                : "HIGH";


    setText(
        "intelRiskScore",
        Math.round(riskScore)
    );


    const riskRing =
        document.querySelector(".metric-ring");

    if (riskRing) {

        riskRing.style.setProperty(
            "--risk",
            riskScore
        );

        riskRing.style.setProperty(
            "--risk-color",
            riskScore < 35
                ? "var(--green)"
                : riskScore < 70
                    ? "var(--yellow)"
                    : "var(--red)"
        );
    }


    setText(
        "intelRiskTier",
        tier
    );


    // ================= RISK FACTORS =================

    let riskFactors = 0;

    if (phishingProbability >= 40) {
        riskFactors++;
    }

    if (
        Number(vtDomain.malicious || 0) > 0 ||
        Number(vtDomain.suspicious || 0) > 0
    ) {
        riskFactors++;
    }

    if (
        Number(abuse.abuse_confidence_score || 0) > 0
    ) {
        riskFactors++;
    }


    setText(
        "intelRiskFactors",
        riskFactors === 0
            ? "0 Risk factor(s) flagged"
            : `${riskFactors} Risk factor(s) flagged`
    );


    // ================= DATA COVERAGE =================

    let sourcesAvailable = 0;

    if (vtDomain.available) {
        sourcesAvailable++;
    }

    if (vtIP.available) {
        sourcesAvailable++;
    }

    if (abuse.available) {
        sourcesAvailable++;
    }


    const dataCoverage =
        Math.round(
            (sourcesAvailable / 3) * 100
        );


    setText(
        "intelConfidence",
        dataCoverage + "%"
    );


    const bar =
        document.getElementById(
            "intelConfidenceBar"
        );

    if (bar) {
        bar.style.width =
            dataCoverage + "%";
    }


    // ================= IP =================

    const ipAddress =
        ti.ip_address ||
        "Not available";


    // ================= VIRUSTOTAL DOMAIN =================

    const vtMalicious =
        Number(vtDomain.malicious || 0);

    const vtSuspicious =
        Number(vtDomain.suspicious || 0);

    const vtHarmless =
        Number(vtDomain.harmless || 0);

    const vtUndetected =
        Number(vtDomain.undetected || 0);


    // ================= ASN =================

    const asn =
        vtIP.asn !== undefined &&
        vtIP.asn !== null
            ? "AS" + vtIP.asn
            : "Not available";


    setText(
        "intelASN",
        asn
    );


    setText(
        "intelASNName",
        vtIP.as_owner ||
        "Not available"
    );


    // ================= NETWORK =================

    setText(
        "intelCIDR",
        vtIP.network ||
        "Not available"
    );


    // We do NOT invent BGP information.
    setText(
        "intelBGPPrefix",
        "Not available from current APIs"
    );


    // ================= ISP =================

    setText(
        "intelISP",
        abuse.isp ||
        vtIP.as_owner ||
        "Not available"
    );


    setText(
        "intelISPCopy",
        abuse.domain ||
        vtIP.as_owner ||
        "Not available"
    );


    // ================= GEOLOCATION =================

    const countryCode =
        abuse.country_code ||
        vtIP.country ||
        "N/A";


    const countryName =
        abuse.country_name ||
        "Not available";


    setText(
        "intelGeo",
        countryName !== "Not available"
            ? `${countryName} (${countryCode})`
            : countryCode
    );


    setText(
        "intelCoords",
        "Coordinates not provided by current APIs"
    );


    // ================= ABUSE =================

    const abuseScore =
        abuse.abuse_confidence_score;


    const totalReports =
        abuse.total_reports;


    if (
        abuseScore !== undefined &&
        abuseScore !== null
    ) {

        setText(
            "intelAbuse",
            `Confidence: ${abuseScore}% | Reports: ${totalReports ?? 0}`
        );

    } else {

        setText(
            "intelAbuse",
            "No AbuseIPDB data available"
        );
    }


    // ================= NOC =================

    setText(
        "intelNOC",
        "Not provided by current APIs"
    );


    // ================= LATENCY =================

    // Backend currently does not return network latency.
    setText(
        "intelLatency",
        "Not available"
    );


    // ================= TELEMETRY ID =================

    const telemetryId =
        "PHG-" +
        Date.now()
            .toString(36)
            .toUpperCase();


    setText(
        "intelUUID",
        telemetryId
    );


    // ================= EXECUTIVE OVERVIEW =================

    const domain =
        ti.domain ||
        safeHostname(url);


    const vtSummary =
        vtDomain.available
            ? `VirusTotal: ${vtMalicious} malicious, ${vtSuspicious} suspicious, ${vtHarmless} harmless, ${vtUndetected} undetected.`
            : "VirusTotal domain data unavailable.";


    const abuseSummary =
        abuse.available
            ? `AbuseIPDB: ${abuseScore ?? 0}% abuse confidence with ${totalReports ?? 0} report(s).`
            : "AbuseIPDB data unavailable.";


    setText(
        "intelExecutive",

        `${domain} was analyzed using PhishGuard AI with a ${Math.round(
            phishingProbability
        )}% phishing probability and ${Math.round(
            riskScore
        )}/100 risk score. ${vtSummary} ${abuseSummary} Network and ownership information is shown only when returned by the connected intelligence sources.`
    );


    // ================= CONSOLE DEBUG =================

    console.log(
        "PhishGuard Threat Intelligence:",
        {
            domain: domain,
            ip: ipAddress,
            asn: asn,
            asOwner: vtIP.as_owner,
            network: vtIP.network,
            country: countryName,
            abuseScore: abuseScore,
            totalReports: totalReports,
            virusTotal: {
                malicious: vtMalicious,
                suspicious: vtSuspicious,
                harmless: vtHarmless,
                undetected: vtUndetected
            }
        }
    );
}
function safeHostname(value) {

    try {

        const normalized =
            /^https?:\/\//i.test(value)
                ? value
                : "https://" + value;


        return new URL(
            normalized
        ).hostname ||
        "Unknown target";

    }

    catch (error) {

        return "Unknown target";
    }
}


function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;
    }
}


function copyIntelUUID() {

    const value =
        document.getElementById(
            "intelUUID"
        )?.textContent || "";


    if (!value) {
        return;
    }


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(value)
            .then(
                () =>
                    alert(
                        "Telemetry UUID copied."
                    )
            );

    }

    else {

        const area =
            document.createElement(
                "textarea"
            );


        area.value = value;

        document.body.appendChild(
            area
        );


        area.select();

        document.execCommand(
            "copy"
        );


        area.remove();


        alert(
            "Telemetry UUID copied."
        );
    }
}


// ================= SECURITY =================

function escapeHTML(value) {

    return value
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}