/* =========================================================
   EVENTSPHERE JAVASCRIPT
   ========================================================= */

let registerMode = false;
let selectedEventName = "";


/* =========================================================
   START WEBSITE
   ========================================================= */

window.addEventListener("load", function () {

    const loginPage = document.getElementById("loginPage");
    const mainWebsite = document.getElementById("mainWebsite");

    if (!loginPage || !mainWebsite) {
        console.error("EventSphere: Required HTML elements not found.");
        return;
    }

    const savedUser = localStorage.getItem("eventSphereUser");

    if (savedUser) {
        showMainWebsite();
    } else {
        showLogin();
    }

});


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

    registerMode = false;

    const loginPage = document.getElementById("loginPage");
    const mainWebsite = document.getElementById("mainWebsite");

    loginPage.style.display = "flex";

    mainWebsite.classList.add("hidden");

    document.getElementById("formTitle").textContent =
        "Welcome Back";

    document.getElementById("formDescription").textContent =
        "Login to continue to EventSphere";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    document.getElementById("username").placeholder =
        "Enter your name";

    document.getElementById("password").placeholder =
        "Enter password";

    document.querySelector(".main-button").textContent =
        "Login";

    document.querySelector(".switch-text").innerHTML =
        "Don't have an account? " +
        '<button onclick="showRegister()" class="link-button">' +
        "Register" +
        "</button>";

    document.getElementById("message").textContent = "";

}


/* =========================================================
   SHOW REGISTER
   ========================================================= */

function showRegister() {

    registerMode = true;

    document.getElementById("formTitle").textContent =
        "Create Account";

    document.getElementById("formDescription").textContent =
        "Create your EventSphere account";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    document.getElementById("username").placeholder =
        "Create your name";

    document.getElementById("password").placeholder =
        "Create password";

    document.querySelector(".main-button").textContent =
        "Register";

    document.querySelector(".switch-text").innerHTML =
        "Already have an account? " +
        '<button onclick="showLogin()" class="link-button">' +
        "Login" +
        "</button>";

    document.getElementById("message").textContent = "";

}


/* =========================================================
   LOGIN / REGISTER
   ========================================================= */

function loginUser() {

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");

    if (!usernameInput || !passwordInput || !message) {
        alert("Login elements are missing.");
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();


    /* EMPTY CHECK */

    if (username === "" || password === "") {

        message.textContent =
            "Please enter name and password.";

        message.style.color = "#ff5555";

        return;
    }


    /* =====================================================
       REGISTER
       ===================================================== */

    if (registerMode) {

        const user = {
            name: username,
            password: password
        };

        localStorage.setItem(
            "eventSphereUser",
            JSON.stringify(user)
        );

        message.textContent =
            "Account created successfully!";

        message.style.color = "#55dd88";


        setTimeout(function () {
            showMainWebsite();
        }, 500);

        return;
    }


    /* =====================================================
       LOGIN
       ===================================================== */

    const savedUser =
        localStorage.getItem("eventSphereUser");

    if (!savedUser) {

        message.textContent =
            "No account found. Please register first.";

        message.style.color = "#ff5555";

        return;
    }


    let user;

    try {

        user = JSON.parse(savedUser);

    } catch (error) {

        localStorage.removeItem("eventSphereUser");

        message.textContent =
            "Account data is invalid. Please register again.";

        message.style.color = "#ff5555";

        return;
    }


    if (
        username === user.name &&
        password === user.password
    ) {

        message.textContent =
            "Login successful!";

        message.style.color = "#55dd88";


        setTimeout(function () {
            showMainWebsite();
        }, 500);

    } else {

        message.textContent =
            "Incorrect name or password.";

        message.style.color = "#ff5555";
    }

}


/* =========================================================
   OPEN MAIN WEBSITE
   ========================================================= */

function showMainWebsite() {

    const loginPage =
        document.getElementById("loginPage");

    const mainWebsite =
        document.getElementById("mainWebsite");

    if (!loginPage || !mainWebsite) {

        alert("Error opening EventSphere website.");

        return;
    }

    loginPage.style.display = "none";

    mainWebsite.classList.remove("hidden");

    window.scrollTo(0, 0);

}


/* =========================================================
   SELECT EVENT
   ========================================================= */

function selectEvent(eventName) {

    selectedEventName = eventName;

    const selectedEvent =
        document.getElementById("selectedEvent");

    if (selectedEvent) {
        selectedEvent.textContent = eventName;
    }


    const amount =
        document.getElementById("amount");

    if (amount) {
        amount.value = "";
    }


    const bookingMessage =
        document.getElementById("bookingMessage");

    if (bookingMessage) {
        bookingMessage.textContent = "";
    }


    const booking =
        document.getElementById("booking");

    if (booking) {

        booking.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   CONFIRM BOOKING
   ========================================================= */

function confirmBooking() {

    const amountInput =
        document.getElementById("amount");

    const bookingMessage =
        document.getElementById("bookingMessage");


    if (!selectedEventName) {

        bookingMessage.textContent =
            "Please select an event first.";

        bookingMessage.style.color = "#ff5555";

        return;
    }


    const amount =
        Number(amountInput.value);


    if (!amount || amount < 500) {

        bookingMessage.textContent =
            "Please enter a valid amount of at least ₹500.";

        bookingMessage.style.color = "#ff5555";

        return;
    }


    const savedUser =
        localStorage.getItem("eventSphereUser");

    let userName = "Guest";


    if (savedUser) {

        try {

            const user =
                JSON.parse(savedUser);

            userName = user.name;

        } catch (error) {

            userName = "Guest";

        }

    }


    const booking = {

        id:
            "ES-" +
            Date.now().toString().slice(-6),

        event:
            selectedEventName,

        amount:
            amount,

        user:
            userName,

        date:
            new Date().toLocaleDateString("en-IN")

    };


    let bookings = [];

    try {

        const oldBookings =
            localStorage.getItem("eventSphereBookings");

        if (oldBookings) {
            bookings = JSON.parse(oldBookings);
        }

        if (!Array.isArray(bookings)) {
            bookings = [];
        }

    } catch (error) {

        bookings = [];

    }


    bookings.push(booking);


    localStorage.setItem(
        "eventSphereBookings",
        JSON.stringify(bookings)
    );


    bookingMessage.innerHTML =
        "<strong>Booking Request Submitted! 🎉</strong><br>" +
        "Event: " + selectedEventName + "<br>" +
        "Budget: ₹" +
        amount.toLocaleString("en-IN") +
        "<br>" +
        "Booking ID: " +
        booking.id;

    bookingMessage.style.color = "#55dd88";

    amountInput.value = "";

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    localStorage.removeItem("eventSphereUser");

    selectedEventName = "";

    showLogin();

}


/* =========================================================
   ENTER KEY
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Enter") {
        return;
    }

    const activeElement =
        document.activeElement;

    if (
        activeElement &&
        (
            activeElement.id === "username" ||
            activeElement.id === "password"
        )
    ) {

        loginUser();

    }

});