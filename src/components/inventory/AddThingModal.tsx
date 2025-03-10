import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import { useInventoryContext } from "@/contexts/inventoryContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import Modal from "../Modal";
import Button from "../Button";
import { Item } from "@/model/Item";
import { Category } from "@/model/category";

interface AddItemModalProps {
    buttonStyle: any;
    saveItem: (category: Category, item: Item) => void;
    saveCategory: (category: Category) => Promise<number>;
}

const MODES = {
    NONE: "",
    ITEM: "item",
    CATEGORY: "category",
};

/**
 * A modal to add an item or a category
 * It displays a button to open the modal
 * The modal contains a text input to enter the name of the item or category and a picker to choose the item category
 *
 * @param props The component props : {buttonStyle, saveItem, saveCategory}
 * @returns The JSX element
 */
export default function AddThingModal(props: AddItemModalProps) {
    const { setModalVisibleCtx } = useModalVisibleContext();
    const { setEditionModeCtx } = useEditionModeContext();
    const { inventoryCtx } = useInventoryContext();
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState(MODES.NONE);
    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!visible) return;
        setMode(MODES.NONE);
        setName("");
        setError("");

        if (categoryName && !inventoryCtx.some((c) => c.name === categoryName)) {
            setCategoryName("");
        }
    }, [visible]);
    useEffect(() => {
        setError("");
    }, [name]);

    const toggleVisible = (value: boolean) => {
        setVisible(value);
        setModalVisibleCtx(value);
    };

    const handleSave = async () => {
        setError("");
        try {
            if (mode === MODES.ITEM) {
                if (!categoryName) {
                    throw new Error("Category is required");
                } else if (!Item.isNameValid(name)) {
                    throw new Error("Item name is invalid");
                }

                props.saveItem(
                    inventoryCtx.find((c) => c.name === categoryName),
                    new Item(0, name.trim())
                );
            } else if (mode === MODES.CATEGORY) {
                if (!Category.isNameValid(name)) {
                    throw new Error("Category name is required");
                }

                props.saveCategory(new Category(0, name.trim()));
            }
            toggleVisible(false);
            setEditionModeCtx(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Button onPress={() => toggleVisible(true)} style={props.buttonStyle}>
                <Text>Add something</Text>
            </Button>
            <Modal
                title={mode === MODES.ITEM ? "Add Item" : mode === MODES.CATEGORY ? "Add Category" : "Choose mode"}
                visible={visible}
                close={() => toggleVisible(false)}
            >
                {mode === MODES.ITEM ? (
                    <AddItemModalContent
                        name={name}
                        setName={setName}
                        categoryName={categoryName}
                        setCategoryName={setCategoryName}
                        categories={inventoryCtx}
                    />
                ) : mode === MODES.CATEGORY ? (
                    <AddCategoryModalContent name={name} setName={setName} />
                ) : (
                    <ChooseModeContent setMode={setMode} categories={inventoryCtx} />
                )}
                {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
                {mode !== MODES.NONE && (
                    <Button onPress={handleSave} style={styles.saveButton}>
                        <Text>Save</Text>
                    </Button>
                )}
            </Modal>
        </>
    );
}

function ChooseModeContent({ setMode, categories }: { setMode: (mode: string) => void; categories: Category[] }) {
    return (
        <>
            {categories.length > 0 && (
                <Button onPress={() => setMode(MODES.ITEM)} style={styles.saveButton}>
                    <Text>Item</Text>
                </Button>
            )}
            <Button onPress={() => setMode(MODES.CATEGORY)} style={styles.saveButton}>
                <Text>Category</Text>
            </Button>
        </>
    );
}
function AddItemModalContent({
    name,
    setName,
    categoryName,
    setCategoryName,
    categories,
}: {
    name: string;
    setName: (name: string) => void;
    categoryName: string;
    setCategoryName: (category: string) => void;
    categories: Category[];
}) {
    useEffect(() => {
        if (!categoryName && categories.length > 0) {
            setCategoryName(categories[0].name);
        }
    }, [categories]);

    return (
        <>
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
        </>
    );
}
function AddCategoryModalContent({ name, setName }: { name: string; setName: (name: string) => void }) {
    return (
        <>
            <TextInput value={name} onChangeText={setName} placeholder="Category name" style={styles.input} />
        </>
    );
}

const styles = StyleSheet.create({
    input: {
        width: "80%",
        height: 40,
        margin: 10,
        padding: 5,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
    },
    picker: {
        width: "100%",
        height: "100%",
    },
    errorMessage: {
        color: "red",
        margin: 10,
    },
    saveButton: {
        width: "80%",
        height: 40,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
});
