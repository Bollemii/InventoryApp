import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Button from "./Button";
import Icon from "./Icon";
import Modal from "./Modal";
import { Category } from "@/model/category";
import HorizontalLine from "./HorizontalLine";
import DeleteItemButton from "./DeleteItemButton";

interface EditCategoryModalProps {
    category: Category;
    edit: (category: Category) => void;
    remove: () => void;
}

export default function EditCategoryModal(props: EditCategoryModalProps) {
    const { settingsCtx } = useSettingsContext();
    const { setModalVisibleCtx } = useModalVisibleContext();
    const [ visible, setVisible ] = useState(false);
    const [ name, setName ] = useState("");
    const [ error, setError ] = useState("");

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
    const handleEditCategory = () => {
        setError("");
        try {
            if (!Category.isNameValid(name)) {
                throw new Error("Category name is invalid");
            }

            if (name.trim() === props.category.name) {
                toggleVisible(false);
                return;
            }

            props.category.name = name.trim();
            props.edit(props.category)

            toggleVisible(false);
        } catch (error) {
            setError(error.message);
        }
    };
    const handleRemoveCategory = () => {
        setError("");
        try {
            if (props.category.items.length > 0) {
                throw new Error("Category is not empty");
            }

            props.remove();
            toggleVisible(false);
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
                visible={visible}
                close={() => toggleVisible(false)}
            >
                <View style={styles.modal}>
                    <Button onPress={() => toggleVisible(false)} style={styles.closeButton}>
                        <Icon icon="xmark" size={20} />
                    </Button>
                    <Text style={styles.title}>
                        Edit "{props.category.name}" category
                    </Text>
                    <TextInput value={name} onChangeText={setName} placeholder="Category name" style={styles.input} />
                    {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
                    <Button onPress={handleEditCategory} style={styles.actionButton}>
                        <Text>Save</Text>
                    </Button>
                    <HorizontalLine width="90%"/>

                    <DeleteItemButton onPress={handleRemoveCategory} style={styles.actionButton}/>
                </View>
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
