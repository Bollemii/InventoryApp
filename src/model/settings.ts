import { log } from "@/logger";
import { colorScheme } from "@/styles/colors";
import { Theme } from "@/types/theme";

export class Settings {
    private _cardsView: boolean;
    private _theme: Theme;

    constructor(cardsView: boolean = false, theme: Theme = colorScheme.light) {
        this._cardsView = cardsView;
        this._theme = theme;
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

    toString(): string {
        return `Settings: CardView ${this._cardsView} - Theme ${this._theme.name}`;
    }
}
