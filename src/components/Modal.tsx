import { Modal as ModalCmp, StyleSheet, View } from "react-native";

interface ModalProps {
    children: React.ReactNode;
    visible: boolean;
    close: () => void;
}

export default function Modal(props: ModalProps) {
    if (!props.visible) return null;
    return (
        <>
            {props.visible && <View style={styles.opacityView} />}
            <ModalCmp visible={props.visible} transparent={true} onRequestClose={props.close}>
                {props.children}
            </ModalCmp>
        </>
    );
}

const styles = StyleSheet.create({
    opacityView: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        backgroundColor: "black",
        opacity: 0.6,
    },
});
