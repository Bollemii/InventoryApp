import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Button from "../Button";
import Icon from "../Icon";
import Modal from "../Modal";
import HorizontalLine from "../HorizontalLine";
import DeleteItemButton from "./DeleteItemButton";
import { Category } from "@/model/category";
import { Item } from "@/model/Item";
import { fetchAllCategories } from "@/dataaccess/categoryRepository";

interface EditItemModalProps {
    item: Item;
    categoryName: string;
    edit: (item: Item, category: Category) => void;
    remove: () => void;
}

export default function EditItemModal(props: EditItemModalProps) {
    const { settingsCtx } = useSettingsContext();
    const { setModalVisibleCtx } = useModalVisibleContext();
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setModalVisibleCtx(false);
        fetchAllCategories().then((categories) => {
            setCategories(categories);
        });
    }, []);
    useEffect(() => {
        if (!visible) return;
        setName(props.item.name);
        setCategoryName(props.categoryName);
        setError("");
        fetchAllCategories().then((categories) => {
            setCategories(categories);
        });
    }, [visible]);
    useEffect(() => {
        setError("");
    }, [name]);

    const toggleVisible = (value: boolean) => {
        setVisible(value);
        setModalVisibleCtx(value);
    };
    const handleEditItem = () => {
        setError("");
        try {
            if (!Category.isNameValid(name)) {
                throw new Error("Category name is invalid");
            }

            if (name.trim() === props.item.name && categoryName === props.categoryName) {
                toggleVisible(false);
                return;
            }

            const newItem = new Item(props.item.id, name.trim(), props.item.quantity);
            const category = categories.find((c) => c.name === categoryName);
            props.edit(newItem, category);

            toggleVisible(false);
        } catch (error) {
            setError(error.message);
        }
    };
    const handleRemoveItem = () => {
        setError("");
        try {
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
                title={`Edit "${props.item.name}" item`}
                visible={visible}
                close={() => toggleVisible(false)}
            >
                <TextInput value={name} onChangeText={setName} placeholder="Item name" style={styles.input} />
                <View style={styles.input}>
                    <Picker
                        selectedValue={categoryName}
                        onValueChange={(value) => setCategoryName(value)}
                        style={styles.picker}
                    >
                        {categories.map((c) => (
                            <Picker.Item key={c.name} label={c.name} value={c.name} />
                        ))}
                    </Picker>
                </View>
                {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
                <Button onPress={handleEditItem} style={styles.actionButton}>
                    <Text>Save</Text>
                </Button>
                <HorizontalLine width="90%" />

                <DeleteItemButton onPress={handleRemoveItem} style={styles.actionButton} />
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: "100%",
    },
    picker: {
        width: "100%",
        height: "100%",
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
