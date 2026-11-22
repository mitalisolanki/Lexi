
  
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
    getMessaging,
    getToken,
    onMessage,
    isSupported
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-messaging.js";

// FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyAEDCSuNyruU1XSuDsyoVyetREdw2RgM-Y",
    authDomain: "lexi-111c5.firebaseapp.com",
    projectId: "lexi-111c5",
    storageBucket: "lexi-111c5.firebasestorage.app",
    messagingSenderId: "44034340852",
    appId: "1:44034340852:web:c33242d065be938968eba1"
};

// VAPID PUBLIC KEY

const vapidKey = "BH_kJtBOn0CQOSHYRB47P3oIaoRp5c-LTR8VM_3ak0g-pUDBdaDMMg0f9L63pxwD5yx8d9Nb3cuqYGY0oXtQ3Ys";

// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);

console.log("Firebase connected successfully!", app.options.projectId);

// CHECK NOTIFICATION SUPPORT

let messaging = null;

const messagingSupported = await isSupported();

if (messagingSupported) {
    messaging = getMessaging(app);
    console.log("Firebase Messaging is supported.");
} else {
    console.log("Firebase Messaging is not supported in this browser.");
}

// ENABLE NOTIFICATIONS

async function enableLexiNotifications() {

    try {

        if (!messaging) {
            throw new Error("Notifications are not supported in this browser.");
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            throw new Error("Notification permission was not granted.");
        }

        const registration = await navigator.serviceWorker.register(
            "/Lexi/firebase-messaging-sw.js",
            { scope: "/Lexi/" }
        );

        const token = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            throw new Error("Could not generate notification token.");
        }

        console.log("Lexi notification token generated successfully.");

        return token;

    } catch (error) {

        console.error("Notification setup failed:", error);
        throw error;

    }
}

// FOREGROUND NOTIFICATIONS

if (messaging) {

    onMessage(messaging, (payload) => {

        console.log("New Lexi notification:", payload);

    });

}

// MAKE FUNCTION AVAILABLE TO THE APP

window.enableLexiNotifications = enableLexiNotifications;

export { app, messaging, enableLexiNotifications };
