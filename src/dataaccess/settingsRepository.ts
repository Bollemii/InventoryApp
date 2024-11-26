import { NotificationRequest } from "types/notifications";
import { Theme } from "types/theme";
import { colorScheme } from "@/styles/colors";
import { log } from "@/logger";
import { Settings } from "@/model/settings";
import { getSetting, setSetting } from "./database/common/settingsDatabase";

const SETTING_KEYS = {
    cardsView: "cardsView",
    theme: "theme",
    notification: "notification",
    categoriesCollapsed: "categoriesCollapsed", // format : ["category1", "category2"]
};

/**
 * Get all settings
 *
 * @returns A promise that resolves to all settings
 */
export async function getSettings(): Promise<Settings> {
    return Promise.all([getCardViewSetting(), getThemeSetting(), getNotificationSetting()]).then(
        ([cardsView, theme, notification]) => {
            return new Settings(cardsView, theme, notification);
        }
    );
}

/**
 * Get the cards view setting
 *
 * @returns A promise that resolves to the cards view setting
 */
export async function getCardViewSetting(): Promise<boolean> {
    return getSetting(SETTING_KEYS.cardsView).then((value) => value === "true");
}

/**
 * Set the cards view setting
 *
 * @param value The new value for the setting
 */
export function setCardViewSetting(value: boolean) {
    setSetting(SETTING_KEYS.cardsView, value.toString());
}

/**
 * Get the theme setting
 *
 * @returns A promise that resolves to the theme setting
 */
export async function getThemeSetting(): Promise<Theme> {
    const themeIndex = await getSetting(SETTING_KEYS.theme);
    return colorScheme[themeIndex] || colorScheme.dark;
}

/**
 * Set the theme setting
 *
 * @param value The new value for the setting
 */
export function setThemeSetting(value: string) {
    if (colorScheme[value] === undefined) {
        log.error(`Invalid theme value: ${value} (SettingsRepository::setThemeSetting)`);
        return;
    }

    setSetting(SETTING_KEYS.theme, value);
}

/**
 * Get the notification setting
 *
 * @returns A promise that resolves to the notification setting
 */
export async function getNotificationSetting(): Promise<NotificationRequest | null> {
    return getSetting(SETTING_KEYS.notification).then((value) => {
        return JSON.parse(value) || null;
    });
}

/**
 * Set the notification setting
 *
 * @param value The new value for the setting
 */
export function setNotificationSetting(value: NotificationRequest) {
    setSetting(SETTING_KEYS.notification, JSON.stringify(value));
}

/**
 * Get if a category is collapsed
 *
 * @param categoryId The category to check
 * @returns A promise that resolves to true if the category is collapsed, false otherwise
 */
export async function isCategoryCollapsed(categoryId: number): Promise<boolean> {
    const categories = await getSetting(SETTING_KEYS.categoriesCollapsed);
    const categoriesArray = categories ? JSON.parse(categories) : [];

    return categoriesArray.includes(categoryId);
}

/**
 * Collapse a category. If the category is already collapsed, it will be expanded.
 *
 * @param categoryId The category to collapse
 */
export async function collapseCategory(categoryId: number) {
    const categories = await getSetting(SETTING_KEYS.categoriesCollapsed);
    const categoriesArray = categories ? JSON.parse(categories) : [];

    if (!categoriesArray.includes(categoryId)) {
        categoriesArray.push(categoryId);
    } else {
        categoriesArray.splice(categoriesArray.indexOf(categoryId), 1);
    }
    setSetting(SETTING_KEYS.categoriesCollapsed, JSON.stringify(categoriesArray));
}
