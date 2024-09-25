import { colorScheme } from "@/styles/colors";
import { getSetting, setSetting } from "./database/settingsDatabase";
import { Settings } from "@/model/settings";
import { Theme } from "types/theme";
import { log } from "@/logger";
import { NotificationRequest } from "types/notifications";

const SETTING_KEYS = {
    cardsView: "cardsView",
    theme: "theme",
    notification: "notification",
};

export async function getSettings(): Promise<Settings> {
    return Promise.all([getCardViewSetting(), getThemeSetting()]).then(([cardsView, theme]) => {
        return new Settings(cardsView, theme);
    });
}

export async function getCardViewSetting(): Promise<boolean> {
    return getSetting(SETTING_KEYS.cardsView).then((value) => value === "true");
}

export function setCardViewSetting(value: boolean): Promise<void> {
    return setSetting(SETTING_KEYS.cardsView, value.toString());
}

export async function getThemeSetting(): Promise<Theme> {
    const themeIndex = await getSetting(SETTING_KEYS.theme);
    return colorScheme[themeIndex] || colorScheme.dark;
}

export function setThemeSetting(value: string): Promise<void> {
    if (colorScheme[value] === undefined) {
        log.error(`Invalid theme value: ${value} (SettingsRepository::setThemeSetting)`);
        return;
    }

    return setSetting(SETTING_KEYS.theme, value);
}

export async function getNotificationSetting(): Promise<NotificationRequest | null> {
    return getSetting(SETTING_KEYS.notification).then((value) => {
        return JSON.parse(value) || null;
    });
}

export function setNotificationSetting(value: NotificationRequest): Promise<void> {
    return setSetting(SETTING_KEYS.notification, JSON.stringify(value));
}
