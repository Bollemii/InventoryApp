import { getSetting, setSetting } from "./database/settingsDatabase";

const SETTING_KEYS = {
    cardsView: "cardsView",
};

export function getCardViewSetting() : Promise<boolean> {
    return getSetting(SETTING_KEYS.cardsView).then((value) => value === "true");
};

export function setCardViewSetting(value: boolean) : Promise<void> {
    return setSetting(SETTING_KEYS.cardsView, value.toString());
};
