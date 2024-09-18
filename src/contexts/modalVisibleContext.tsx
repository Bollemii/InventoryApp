import { createContext, useContext, useState } from "react";

export const ModalVisibleContext = createContext<{
    modalVisibleCtx: boolean;
    setModalVisibleCtx: (modalVisible: boolean) => void;
}>({
    modalVisibleCtx: false,
    setModalVisibleCtx: () => {},
});

export default function ModalVisibleContextProvider({ children }) {
    const [modalVisibleCtx, setModalVisibleCtx] = useState(false);

    return <ModalVisibleContext.Provider value={{ modalVisibleCtx, setModalVisibleCtx }}>{children}</ModalVisibleContext.Provider>;
}

export function useModalVisibleContext() {
    return useContext(ModalVisibleContext);
}
