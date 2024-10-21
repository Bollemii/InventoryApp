import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import Button from "../Button";
import Icon from "../Icon";
import Modal from "../Modal";
import HorizontalLine from "../HorizontalLine";
import DeleteItemButton from "./DeleteItemButton";
import { Category } from "@/model/category";

interface EditCategoryModalProps {
    category: Category;
    edit: (name: string) => void;
    remove: () => void;
}

/**
 * An edit category modal component to edit or remove a category
 * It displays a button to open the modal
 * The modal contains a text input to enter the new category name
 *
 * @param props The component props : {category, edit, remove}
 * @returns The JSX element
 */
export default function EditCategoryModal(props: EditCategoryModalProps) {
    const { settingsCtx } = useSettingsContext();
    const { setModalVisibleCtx } = useModalVisibleContext();
    const { setEditionModeCtx } = useEditionModeContext();
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setModalVisibleCtx(false);
    }, []);
    useEffect(() => {
        if (!visible) return;
        setName(props.category.name);
        setError("");
    }, [visible]);
    useEffect(() => {
        setError("");
    }, [name]);

    const toggleVisible = (value: boolean) => {
        setVisible(value);
        setModalVisibleCtx(value);
    };
    const handleRename = () => {
        setError("");
        try {
            if (!Category.isNameValid(name)) {
                throw new Error("Category name is invalid");
            }

            if (name.trim() === props.category.name) {
                toggleVisible(false);
                return;
            }

            props.edit(name);

            toggleVisible(false);
            setEditionModeCtx(false);
        } catch (error) {
            setError(error.message);
        }
    };
    const handleRemove = () => {
        setError("");
        try {
            if (props.category.items.length > 0) {
                throw new Error("Category is not empty");
            }

            props.remove();
            toggleVisible(false);
            setEditionModeCtx(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Button
                onPress={() => toggleVisible(true)}
                style={styles.button}
                colors={{
                    normal: settingsCtx.theme.colors.items.button.normal,
                    pressed: settingsCtx.theme.colors.items.button.pressed,
                }}
            >
                <Icon icon="pen" size={13} color={settingsCtx.theme.colors.items.button.icon} />
            </Button>
            <Modal
                title={`Edit "${props.category.name}" category`}
                visible={visible}
                close={() => toggleVisible(false)}
            >
                <TextInput value={name} onChangeText={setName} placeholder="Category name" style={styles.input} />
                {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
                <Button onPress={handleRename} style={styles.actionButton}>
                    <Text>Save</Text>
                </Button>
                <HorizontalLine width="90%" />

                <DeleteItemButton onPress={handleRemove} style={styles.actionButton} />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        left: 5,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 25,
        width: 80,
    },
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
    },
    input: {
        width: "80%",
        height: 40,
        margin: 10,
        padding: 5,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
    },
    errorMessage: {
        color: "red",
        margin: 10,
    },
    actionButton: {
        width: "80%",
        height: 40,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
});
