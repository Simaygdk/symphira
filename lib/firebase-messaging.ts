import { getToken, onMessage, Messaging } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestPermissionAndGetToken = async () => {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: "BNRsgHOsmuR4HkZM0SwTtBydUNqijpU2-mVIK0al-n2LbAUYkw2xgIGMZtRp9H0a7bnk1rjX_w2QdsP3bMNdf58", // senin public key
    });

    console.log("✅ FCM Token:", token);
    return token;
  } catch (err) {
    console.error("❌ Failed to get FCM token:", err);
    return null;
  }
};

export const onForegroundMessage = (
  callback: (payload: any) => void
): void => {
  if (!messaging) return;
  onMessage(messaging as Messaging, callback);
};
