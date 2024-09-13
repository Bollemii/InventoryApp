import { Modal as ModalCmp } from "react-native";

interface ModalProps {
    children: React.ReactNode;
    visible: boolean;
    close: () => void;
}

export default function Modal(props: ModalProps) {
    if (!props.visible) return null;
    return (
        <ModalCmp
            visible={props.visible}
            transparent={true}
            onRequestClose={props.close}
        >
            {props.children}
        </ModalCmp>
    );
}
