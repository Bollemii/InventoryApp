import EditionModeContextProvider from "./editionModeContext";
import ModalVisibleContextProvider from "./modalVisibleContext";
import SettingsContextProvider from "./settingsContext";

export default function ContextsProvider({ children }) {
    return (
        <SettingsContextProvider>
            <EditionModeContextProvider>
                <ModalVisibleContextProvider>
                    {children}
                </ModalVisibleContextProvider>
            </EditionModeContextProvider>
        </SettingsContextProvider>
    );
}
