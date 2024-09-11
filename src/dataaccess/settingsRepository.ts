import { Theme, colorScheme } from "@/styles/colors";
import { getSetting, setSetting } from "./database/settingsDatabase";

const SETTING_KEYS = {
    cardsView: "cardsView",
    theme: "theme",
};

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
        console.error(`Invalid theme value: ${value}`);
        return;
    }

    return setSetting(SETTING_KEYS.theme, value);
}
