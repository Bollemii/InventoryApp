import { log } from "@/logger";
import { colorScheme } from "@/styles/colors";
import { NotificationRequest } from "types/notifications";
import { Theme } from "types/theme";

/**
 * The settings model
 * It contains the settings of the application : cards view and theme
 */
export class Settings {
    private _cardsView: boolean;
    private _theme: Theme;
    private _notification: NotificationRequest;

    constructor(cardsView: boolean = false, theme: Theme = colorScheme.light, notification: NotificationRequest | null = null) {
        this._cardsView = cardsView;
        this._theme = theme;
        this._notification = notification;
    }

    get cardsView() {
        return this._cardsView;
    }

    set cardsView(value: boolean) {
        this._cardsView = value;
    }

    get theme() {
        return this._theme;
    }

    set theme(value: Theme) {
        if (colorScheme[value.name] === undefined) {
            log.error(`Invalid theme value: ${value} (Settings::setTheme)`);
            return;
        }

        this._theme = value;
    }

    get notification() {
        return this._notification;
    }

    set notification(value: NotificationRequest) {
        this._notification = value;
    }

    toString(): string {
        return `Settings: CardView ${this._cardsView} - Theme ${this._theme.name} - Notification ${this._notification}`;
    }
}
