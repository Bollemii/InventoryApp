import { Modal as ModalCmp, StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import Icon from "./Icon";

interface ModalProps {
    children: React.ReactNode;
    title: string;
    visible: boolean;
    close: () => void;
    style?: any;
}

/**
 * A modal component with a title and a close button
 * 
 * @param props The component props : {children, title, visible, close, style}
 * @returns The JSX element
 */
export default function Modal(props: ModalProps) {
    if (!props.visible) return null;
    return (
        <ModalCmp visible={props.visible} transparent={true} onRequestClose={props.close}>
            <View style={[styles.modal, props.style]}>
                <Button onPress={props.close} style={styles.closeButton}>
                    <Icon icon="xmark" size={20} />
                </Button>
                <Text style={styles.title}>{props.title}</Text>
                {props.children}
            </View>
        </ModalCmp>
    );
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        top: "35%",
        width: "80%",
        paddingTop: 40,
        backgroundColor: "white",
        borderWidth: 1,
        elevation: 10,
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 0,
        height: 30,
        width: 30,
    },
    title: {
        position: "absolute",
        top: 5,
        left: 5,
        fontSize: 16,
        fontWeight: "bold",
    },
});
