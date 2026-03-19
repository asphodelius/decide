import Constants from "expo-constants";

let notificationsModulePromise: Promise<typeof import("expo-notifications") | null> | null = null;
let notificationChannelReady = false;

function isExpoGo() {
  return Constants.executionEnvironment === "storeClient" || Constants.appOwnership === "expo";
}

async function getNotificationsModule() {
  if (notificationsModulePromise) {
    return notificationsModulePromise;
  }

  if (isExpoGo()) {
    notificationsModulePromise = Promise.resolve(null);
    return null;
  }

  notificationsModulePromise = import("expo-notifications").then((Notifications) => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    return Notifications;
  });

  return notificationsModulePromise;
}

export async function scheduleReminderNotification(title: string, body: string, seconds: number) {
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return null;
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== "granted") {
    return null;
  }

  if (Constants.platform?.android && !notificationChannelReady) {
    await Notifications.setNotificationChannelAsync("decide-reminders", {
      name: "Decide Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#7DD3FC",
    });
    notificationChannelReady = true;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
      ...(Constants.platform?.android ? { channelId: "decide-reminders" } : {}),
    },
  });
}
