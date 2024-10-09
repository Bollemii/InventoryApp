import { createContext, useContext, useState } from "react";

/**
 * The edition mode context
 */
export const EditionModeContext = createContext<{
    editionModeCtx: boolean;
    setEditionModeCtx: (editionMode: boolean) => void;
}>({
    editionModeCtx: false,
    setEditionModeCtx: () => {},
});

/**
 * The edition mode context provider
 * 
 * @param children The children components
 * @returns The JSX element
 */
export default function EditionModeContextProvider({ children }) {
    const [editionModeCtx, setEditionModeCtx] = useState(false);

    return <EditionModeContext.Provider value={{ editionModeCtx, setEditionModeCtx }}>{children}</EditionModeContext.Provider>;
}

/**
 * Hook to use the edition mode context
 * 
 * @returns The edition mode context
 */
export function useEditionModeContext() {
    return useContext(EditionModeContext);
}
