export interface WeeklyNotificationTrigger {
    weekday: number;
    hour: number;
    minute: number;
    repeats?: boolean;
}

export interface NotificationRequest {
    identifier: string;
    content: {
        title: string;
        body: string;
    };
    trigger: WeeklyNotificationTrigger;
}
