import * as Notifications from "expo-notifications";

import { NotificationRequest, WeeklyNotificationTrigger } from "@/types/notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

async function allowNotification(): Promise<boolean> {
    let permission = await Notifications.getPermissionsAsync();
    if (permission.status !== "granted") {
        permission = await Notifications.requestPermissionsAsync();
    }

    return permission.status === "granted";
}

export async function getAllScheduledNotifications(): Promise<NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
}

export async function scheduleNotification(title: string, body: string, trigger: WeeklyNotificationTrigger) {
    if (!(await allowNotification())) {
        return;
    }

    if (!trigger.repeats) {
        trigger.repeats = true;
    }
    Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger,
    });
}

export async function cancelNotification(id: string) {
    if (!(await allowNotification())) {
        return;
    }

    await Notifications.cancelScheduledNotificationAsync(id);
}
