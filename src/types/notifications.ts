import { NotificationContent, NotificationTrigger } from "expo-notifications";

export interface WeeklyNotificationTrigger {
    weekday: number;
    hour: number;
    minute: number;
    repeats?: boolean;
}

export interface NotificationRequest {
    identifier: string;
    content: NotificationContent;
    trigger: NotificationTrigger;
}
