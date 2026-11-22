
importScripts("https://www.gstatic.com/firebasejs/13.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/13.3.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAEDCSuNyruU1XSuDsyoVyetREdw2RgM-Y",
    authDomain: "lexi-111c5.firebaseapp.com",
    projectId: "lexi-111c5",
    storageBucket: "lexi-111c5.firebasestorage.app",
    messagingSenderId: "44034340852",
    appId: "1:44034340852:web:c33242d065be938968eba1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle =
        payload.notification?.title || "Lexi - Your Daily Word";

    const notificationOptions = {
        body: payload.notification?.body || "Your daily vocabulary word is ready.",
        icon: "https://mitalisolanki.github.io/Lexi/"
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});
