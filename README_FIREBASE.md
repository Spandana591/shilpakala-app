# Firebase Setup for Shilpa-Kala Android App

To fully activate the Android application, follow these steps in the [Firebase Console](https://console.firebase.google.com/):

### 1. Register Android App
1. Go to **Project Settings**.
2. Click **Add App** and select **Android**.
3. Use Package Name: `com.shilpa.kala`.
4. Download `google-services.json` and replace the placeholder in `app/google-services.json`.

### 2. Enable Authentication
1. Go to **Build > Authentication**.
2. Enable **Email/Password**.
3. Enable **Google** sign-in (requires SHA-1).

### 3. Setup SHA-1 for Google Sign-In
1. In Android Studio, open the **Gradle** tab on the right.
2. Go to `app > tasks > android > signingReport`.
3. Copy the **SHA-1** fingerprint and paste it into project settings in Firebase.

### 4. Enable Firestore & Storage
1. Enable **Cloud Firestore** in your preferred region.
2. Enable **Cloud Storage**.
3. Deploy the `firestore.rules` provided in this project.

### 5. Security Rules
Deploy the following to Firestore:
```javascript
// Paste content of firestore.rules here
```
