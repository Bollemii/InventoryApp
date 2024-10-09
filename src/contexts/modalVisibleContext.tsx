import { createContext, useContext, useState } from "react";

/**
 * The modal visible context
 */
export const ModalVisibleContext = createContext<{
    modalVisibleCtx: boolean;
    setModalVisibleCtx: (modalVisible: boolean) => void;
}>({
    modalVisibleCtx: false,
    setModalVisibleCtx: () => {},
});

/**
 * The modal visible context provider
 * 
 * @param children The children components
 * @returns The JSX element
 */
export default function ModalVisibleContextProvider({ children }) {
    const [modalVisibleCtx, setModalVisibleCtx] = useState(false);

    return <ModalVisibleContext.Provider value={{ modalVisibleCtx, setModalVisibleCtx }}>{children}</ModalVisibleContext.Provider>;
}

/**
 * Hook to use the modal visible context
 * 
 * @returns The modal visible context
 */
export function useModalVisibleContext() {
    return useContext(ModalVisibleContext);
}
