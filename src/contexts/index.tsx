import SettingsContextProvider from "./settingsContext";

export default function ContextsProvider({ children }) {
    return <SettingsContextProvider>{children}</SettingsContextProvider>;
}
