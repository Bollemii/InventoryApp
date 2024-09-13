import EditionModeContextProvider from "./editionModeContext";
import SettingsContextProvider from "./settingsContext";

export default function ContextsProvider({ children }) {
    return (
        <SettingsContextProvider>
            <EditionModeContextProvider>
                {children}
            </EditionModeContextProvider>
        </SettingsContextProvider>
    );
}
