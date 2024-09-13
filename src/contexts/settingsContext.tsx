import { createContext, useContext, useEffect, useState } from "react";

import { Settings } from "@/model/settings";
import { getSettings } from "@/dataaccess/settingsRepository";

export const SettingsContext = createContext<{
    settingsCtx: Settings;
    setSettingsCtx: (settings: Settings) => void;
}>({
    settingsCtx: new Settings(),
    setSettingsCtx: () => {},
});

export default function SettingsContextProvider({ children }) {
    const [settingsCtx, setSettingsCtx] = useState(new Settings());

    useEffect(() => {
        getSettings().then((settings) => setSettingsCtx(settings));
    }, []);

    return <SettingsContext.Provider value={{ settingsCtx, setSettingsCtx }}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
    return useContext(SettingsContext);
}
