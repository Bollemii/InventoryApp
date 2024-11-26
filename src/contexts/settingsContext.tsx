import { createContext, useContext, useEffect, useState } from "react";

import { Settings } from "@/model/settings";
import { getSettings } from "@/dataaccess/settingsRepository";

/**
 * The settings context
 */
export const SettingsContext = createContext<{
    settingsCtx: Settings;
    setSettingsCtx: (settings: Settings) => void;
}>({
    settingsCtx: new Settings(),
    setSettingsCtx: () => {},
});

/**
 * The settings context provider
 * 
 * @param children The children components
 * @returns The JSX element
 */
export default function SettingsContextProvider({ children }) {
    const [settingsCtx, setSettingsCtx] = useState(new Settings());

    useEffect(() => {
        getSettings().then((settings) => setSettingsCtx(settings));
    }, []);

    return <SettingsContext.Provider value={{ settingsCtx, setSettingsCtx }}>{children}</SettingsContext.Provider>;
}

/**
 * Hook to use the settings context
 * 
 * @returns The settings context
 */
export function useSettingsContext() {
    return useContext(SettingsContext);
}
