import EditionModeContextProvider from "./editionModeContext";
import ModalVisibleContextProvider from "./modalVisibleContext";
import SettingsContextProvider from "./settingsContext";

/**
 * The contexts provider
 * 
 * @param children The children components
 * @returns The JSX element
 */
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
