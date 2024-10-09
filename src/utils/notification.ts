import * as Notifications from "expo-notifications";

import { NotificationRequest, WeeklyNotificationTrigger } from "types/notifications";

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

/**
 * Get all scheduled notifications
 * 
 * @returns An array of all scheduled notifications
 */
export async function getAllScheduledNotifications(): Promise<NotificationRequest[]> {
    return (await Notifications.getAllScheduledNotificationsAsync()).map((notif) => ({
        identifier: notif.identifier,
        content: {
            title: notif.content.title,
            body: notif.content.body,
        },
        trigger: {
            weekday: (notif.trigger as WeeklyNotificationTrigger)?.weekday,
            hour: (notif.trigger as WeeklyNotificationTrigger)?.hour,
            minute: (notif.trigger as WeeklyNotificationTrigger)?.minute,
            repeats: (notif.trigger as WeeklyNotificationTrigger)?.repeats,
        },
    }));
}

/**
 * Schedule a notification
 * 
 * @param title The title of the notification 
 * @param body The message of the notification
 * @param trigger The trigger for the notification (when to show it)
 * @returns The scheduled notification
 */
export async function scheduleNotification(title: string, body: string, trigger: WeeklyNotificationTrigger) : Promise<NotificationRequest> {
    if (!(await allowNotification())) {
        return;
    }

    if (!trigger.repeats) {
        trigger.repeats = true;
    }
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger,
    });

    return {
        identifier: id,
        content: {
            title,
            body,
        },
        trigger,
    };
}

/**
 * Schedule a notification to remind the user to update their inventory
 * @param weekday Weekday (0 Monday - 6 Sunday)
 * @param hour Hour of the day
 * @returns The scheduled notification
 */
export async function scheduleInventoryNotification(weekday: number, hour: number) : Promise<NotificationRequest> {
    if (!(await allowNotification())) {
        return;
    }

    // Enter : 0 Monday - 6 Sunday
    if (weekday < 0 || weekday > 6) {
        throw new Error("Invalid weekday. Must be between 0 and 6. Found: " + weekday);
    }
    // Need to convert to 1 Sunday - 7 Saturday
    weekday = (weekday + 2) % 7;
    const notif = await scheduleNotification("Inventaire", "N'oubliez pas de mettre à jour votre inventaire", {
        weekday,
        hour,
        minute: 0,
        repeats: true,
    });
    // Reconverting to 0 Monday - 6 Sunday
    notif.trigger.weekday = (notif.trigger.weekday + 5) % 7;
    return notif;
}

/**
 * Cancel a scheduled notification
 * 
 * @param id The id of the notification to cancel
 */
export async function cancelNotification(id: string) {
    if (!(await allowNotification())) {
        return;
    }

    await Notifications.cancelScheduledNotificationAsync(id);
}
