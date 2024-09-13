import { createContext, useContext, useState } from "react";

export const EditionModeContext = createContext<{
    editionModeCtx: boolean;
    setEditionModeCtx: (editionMode: boolean) => void;
}>({
    editionModeCtx: false,
    setEditionModeCtx: () => {},
});

export default function EditionModeContextProvider({ children }) {
    const [editionModeCtx, setEditionModeCtx] = useState(false);

    return <EditionModeContext.Provider value={{ editionModeCtx, setEditionModeCtx }}>{children}</EditionModeContext.Provider>;
}

export function useEditionModeContext() {
    return useContext(EditionModeContext);
}
