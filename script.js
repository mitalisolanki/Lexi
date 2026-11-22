


// LEXI APPLICATION

// Check whether vocabulary data is available.

if (!window.lexiWords || window.lexiWords.length === 0) {
    alert("Vocabulary data could not be loaded. Please check words.js.");
}


// LOCAL STORAGE

let savedWords = JSON.parse(
    localStorage.getItem("lexiSavedWords") || "[]"
);

let learnedDates = JSON.parse(
    localStorage.getItem("lexiLearnedDates") || "[]"
);


// NOTIFICATION SETTINGS

let notificationTime = localStorage.getItem("lexiNotificationTime") || "08:00";


// SAVE DATA

function saveData() {
    localStorage.setItem("lexiSavedWords", JSON.stringify(savedWords));
    localStorage.setItem("lexiLearnedDates", JSON.stringify(learnedDates));
}


// HELPER FUNCTIONS

function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}


function findWord(wordName) {
    return window.lexiWords.find(
        word => word.word.toLowerCase() === wordName.toLowerCase()
    );
}


// NAVIGATION

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(button => {
    button.addEventListener("click", function () {

        const selectedPage = this.dataset.page;

        navButtons.forEach(btn => btn.classList.remove("active"));
        pages.forEach(page => page.classList.remove("active"));

        this.classList.add("active");

        const selectedSection = document.getElementById(selectedPage);

        if (selectedSection) {
            selectedSection.classList.add("active");
        }

        if (selectedPage === "vocabulary") {
            displaySavedWords();
        }

        if (selectedPage === "tracker") {
            updateTracker();
        }

        if (selectedPage === "settings") {
            loadNotificationSettings();
        }

    });
});


// DAILY WORD

function displayDailyWord() {

    if (!window.lexiWords || window.lexiWords.length === 0) {
        return;
    }

    const startDate = new Date(2026, 0, 1);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = Math.floor(
        (today - startDate) / (1000 * 60 * 60 * 24)
    );

    const wordIndex =
        ((difference % window.lexiWords.length) +
        window.lexiWords.length) %
        window.lexiWords.length;

    const word = window.lexiWords[wordIndex];

    document.getElementById("dailyWord").textContent = word.word;
    document.getElementById("dailyPronunciation").textContent =
        word.pronunciation || "";
    document.getElementById("dailyMeaning").textContent = word.meaning;
    document.getElementById("dailyExample").textContent = word.example;

    document.getElementById("dailySynonyms").textContent =
        Array.isArray(word.synonyms)
            ? word.synonyms.join(", ")
            : "";

    document.getElementById("dailyLevel").textContent = word.level;
    document.getElementById("dailyCategory").textContent = word.category;

    document.getElementById("saveDailyBtn").onclick = function () {
        saveWord(word.word);
    };

    document.getElementById("learnDailyBtn").onclick = function () {
        markAsLearned();
    };

    updateDailyButtons(word);
}


function updateDailyButtons(word) {

    const saveButton = document.getElementById("saveDailyBtn");
    const learnButton = document.getElementById("learnDailyBtn");

    saveButton.textContent = savedWords.includes(word.word)
        ? "Saved"
        : "Save Word";

    learnButton.textContent = learnedDates.includes(getToday())
        ? "Learned Today"
        : "Mark as Learned";
}


function saveWord(wordName) {

    if (!savedWords.includes(wordName)) {

        savedWords.push(wordName);
        saveData();

        document.getElementById("dailyMessage").textContent =
            "Word added to My Vocabulary.";

    } else {

        document.getElementById("dailyMessage").textContent =
            "This word is already in My Vocabulary.";

    }

    const word = findWord(wordName);

    if (word) {
        updateDailyButtons(word);
    }
}


// MARK AS LEARNED

function markAsLearned() {

    const today = getToday();

    if (learnedDates.includes(today)) {
        document.getElementById("dailyMessage").textContent =
            "You have already marked today's learning.";

        return;
    }

    learnedDates.push(today);
    saveData();

    document.getElementById("dailyMessage").textContent =
        "Today's learning has been recorded.";

    const currentWord = window.lexiWords.find(
        word => word.word === document.getElementById("dailyWord").textContent
    );

    if (currentWord) {
        updateDailyButtons(currentWord);
    }
}


// PERSONALIZED VOCABULARY

function loadCategories() {

    const categoryFilter = document.getElementById("categoryFilter");

    const categories = [
        ...new Set(
            window.lexiWords.map(word => word.category).filter(Boolean)
        )
    ];

    categories.sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


function displayExploreWords() {

    const level = document.getElementById("levelFilter").value;
    const category = document.getElementById("categoryFilter").value;

    const container = document.getElementById("exploreWords");

    container.innerHTML = "";

    const filteredWords = window.lexiWords.filter(word => {

        const matchesLevel =
            level === "All" || word.level === level;

        const matchesCategory =
            category === "All" || word.category === category;

        return matchesLevel && matchesCategory;
    });

    if (filteredWords.length === 0) {

        container.innerHTML =
            '<p class="empty-message">No words found for these filters.</p>';

        return;
    }

    filteredWords.forEach(word => {

        const isSaved = savedWords.includes(word.word);

        const card = document.createElement("div");

        card.className = "word-card";

        card.innerHTML = `
            <h3>${escapeHTML(word.word)}</h3>

            <p class="pronunciation">
                ${escapeHTML(word.pronunciation || "")}
            </p>

            <span class="tag">${escapeHTML(word.level)}</span>

            <span class="tag">${escapeHTML(word.category)}</span>

            <p class="word-meaning">
                ${escapeHTML(word.meaning)}
            </p>

            <p class="word-example">
                ${escapeHTML(word.example)}
            </p>

            <div class="card-actions">
                <button class="card-btn save-btn">
                    ${isSaved ? "Saved" : "Save Word"}
                </button>
            </div>
        `;

        const saveButton = card.querySelector(".save-btn");

        saveButton.addEventListener("click", function () {
            saveWord(word.word);
            displayExploreWords();
        });

        container.appendChild(card);
    });
}


document.getElementById("levelFilter").addEventListener(
    "change",
    displayExploreWords
);

document.getElementById("categoryFilter").addEventListener(
    "change",
    displayExploreWords
);


// MY VOCABULARY

function displaySavedWords() {

    const container = document.getElementById("savedWords");

    const search = document.getElementById("searchSaved")
        .value.toLowerCase();

    container.innerHTML = "";

    document.getElementById("savedCount").textContent =
        savedWords.length;

    const filteredWords = savedWords.filter(wordName =>
        wordName.toLowerCase().includes(search)
    );

    if (filteredWords.length === 0) {

        container.innerHTML = savedWords.length === 0
            ? '<p class="empty-message">You have not saved any words yet. Explore vocabulary and save the words you like.</p>'
            : '<p class="empty-message">No matching words found.</p>';

        return;
    }

    filteredWords.forEach(wordName => {

        const word = findWord(wordName);

        if (!word) {
            return;
        }

        const card = document.createElement("div");

        card.className = "word-card";

        card.innerHTML = `
            <h3>${escapeHTML(word.word)}</h3>

            <p class="pronunciation">
                ${escapeHTML(word.pronunciation || "")}
            </p>

            <span class="tag">${escapeHTML(word.level)}</span>

            <span class="tag">${escapeHTML(word.category)}</span>

            <p class="word-meaning">
                ${escapeHTML(word.meaning)}
            </p>

            <p class="word-example">
                ${escapeHTML(word.example)}
            </p>

            <div class="card-actions">
                <button class="card-btn remove-btn">
                    Remove Word
                </button>
            </div>
        `;

        const removeButton = card.querySelector(".remove-btn");

        removeButton.addEventListener("click", function () {
            removeSavedWord(word.word);
        });

        container.appendChild(card);
    });
}


function removeSavedWord(wordName) {

    savedWords = savedWords.filter(
        word => word !== wordName
    );

    saveData();

    displaySavedWords();
    displayExploreWords();

    const dailyWord = document.getElementById("dailyWord").textContent;

    if (dailyWord === wordName) {

        const word = findWord(wordName);

        if (word) {
            updateDailyButtons(word);
        }
    }
}


document.getElementById("searchSaved").addEventListener(
    "input",
    displaySavedWords
);


// CONSISTENCY TRACKER

let calendarDate = new Date();


function calculateCurrentStreak() {

    let streak = 0;

    const date = new Date();

    date.setHours(0, 0, 0, 0);

    let dateString = getDateString(date);

    if (!learnedDates.includes(dateString)) {
        date.setDate(date.getDate() - 1);
        dateString = getDateString(date);
    }

    while (learnedDates.includes(dateString)) {

        streak++;

        date.setDate(date.getDate() - 1);
        dateString = getDateString(date);
    }

    return streak;
}


function getDateString(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function calculateLongestStreak() {

    if (learnedDates.length === 0) {
        return 0;
    }

    const sortedDates = [...new Set(learnedDates)].sort();

    let longest = 1;
    let current = 1;

    for (let i = 1; i < sortedDates.length; i++) {

        const previousDate = new Date(
            sortedDates[i - 1] + "T00:00:00"
        );

        const currentDate = new Date(
            sortedDates[i] + "T00:00:00"
        );

        const difference = Math.round(
            (currentDate - previousDate) / (1000 * 60 * 60 * 24)
        );

        if (difference === 1) {
            current++;
        } else {
            current = 1;
        }

        longest = Math.max(longest, current);
    }

    return longest;
}


function updateTracker() {

    document.getElementById("totalDays").textContent =
        learnedDates.length;

    document.getElementById("currentStreak").textContent =
        calculateCurrentStreak();

    document.getElementById("longestStreak").textContent =
        calculateLongestStreak();

    displayCalendar();
}


// CALENDAR

function displayCalendar() {

    const calendar = document.getElementById("calendar");

    calendar.innerHTML = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthName = calendarDate.toLocaleString(
        "default",
        { month: "long" }
    );

    document.getElementById("calendarMonth").textContent =
        `${monthName} ${year}`;

    const headings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    headings.forEach(day => {

        const heading = document.createElement("div");

        heading.className = "calendar-day heading";
        heading.textContent = day;

        calendar.appendChild(heading);
    });

    const firstDay = new Date(year, month, 1).getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {

        const date = new Date(year, month, day);

        const dateString = getDateString(date);

        const cell = document.createElement("div");

        cell.className = "calendar-day";
        cell.textContent = day;

        if (learnedDates.includes(dateString)) {
            cell.classList.add("learned");
        }

        if (dateString === getToday()) {
            cell.classList.add("today");
        }

        calendar.appendChild(cell);
    }
}


document.getElementById("previousMonth").addEventListener(
    "click",
    function () {

        calendarDate.setMonth(calendarDate.getMonth() - 1);

        displayCalendar();
    }
);


document.getElementById("nextMonth").addEventListener(
    "click",
    function () {

        calendarDate.setMonth(calendarDate.getMonth() + 1);

        displayCalendar();
    }
);


// SETTINGS - NOTIFICATION TIME

function loadNotificationSettings() {

    const timeInput = document.getElementById("notificationTime");

    if (!timeInput) {
        return;
    }

    const savedTime = localStorage.getItem("lexiNotificationTime");

    timeInput.value = savedTime || "08:00";
}


function saveNotificationSettings() {

    const timeInput = document.getElementById("notificationTime");
    const message = document.getElementById("notificationMessage");

    if (!timeInput || !message) {
        return;
    }

    if (!timeInput.value) {

        message.textContent = "Please select a notification time.";

        return;
    }

    notificationTime = timeInput.value;

    localStorage.setItem(
        "lexiNotificationTime",
        notificationTime
    );

    message.textContent =
        `Your preferred reminder time is saved: ${notificationTime}.`;

}


const saveNotificationButton =
    document.getElementById("saveNotificationTime");

if (saveNotificationButton) {

    saveNotificationButton.addEventListener(
        "click",
        saveNotificationSettings
    );

}


// INITIALIZE LEXI

function initializeLexi() {

    if (!window.lexiWords || window.lexiWords.length === 0) {
        return;
    }

    displayDailyWord();

    loadCategories();

    displayExploreWords();

    displaySavedWords();

    updateTracker();

    loadNotificationSettings();
}


initializeLexi();


// ENABLE FIREBASE NOTIFICATIONS

const enableNotificationsButton =
    document.getElementById("enableNotifications");

if (enableNotificationsButton) {

    enableNotificationsButton.addEventListener("click", async () => {

        const statusMessage =
            document.getElementById("notificationStatus");

        enableNotificationsButton.disabled = true;
        enableNotificationsButton.textContent = "Enabling...";

        try {

            if (!window.enableLexiNotifications) {
                throw new Error("Firebase notification system is not ready. Please refresh the page.");
            }

            await window.enableLexiNotifications();

            statusMessage.textContent =
                "Notifications enabled successfully on this device!";

        } catch (error) {

            statusMessage.textContent =
                error.message || "Could not enable notifications.";

            console.error(error);

        } finally {

            enableNotificationsButton.disabled = false;
            enableNotificationsButton.textContent =
                "Enable Notifications";

        }

    });

}

