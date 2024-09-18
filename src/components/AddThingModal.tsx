import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useModalVisibleContext } from "@/contexts/modalVisibleContext";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icon";
import { Item } from "@/model/Item";
import { Category } from "@/model/category";
import { fetchAllCategories } from "@/dataaccess/categoryRepository";

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

export default function AddThingModal(props: AddItemModalProps) {
    const { setModalVisibleCtx } = useModalVisibleContext();
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState(MODES.NONE);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState<string>("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAllCategories().then((categories) => {
            setCategories(categories);
            if (categoryName && !categories.some((c) => c.name === categoryName)) {
                setCategoryName("");
            }
        });
    }, []);
    useEffect(() => {
        if (!visible) return;
        setMode(MODES.NONE);
        setName("");
        setError("");

        fetchAllCategories().then((categories) => {
            setCategories(categories);
            if (categoryName && !categories.some((c) => c.name === categoryName)) {
                setCategoryName("");
            }
        });
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
        let idResult: number;
        try {
            if (mode === MODES.ITEM) {
                if (!categoryName) {
                    throw new Error("Category is required");
                } else if (!Item.isNameValid(name)) {
                    throw new Error("Item name is invalid");
                }

                const category = categories.find((c) => c.name === categoryName);
                console.log(categoryName);
                console.log(categories);
                console.log(category);
                props.saveItem(category, new Item(0, name.trim(), 0));
            } else if (mode === MODES.CATEGORY) {
                if (!Category.isNameValid(name)) {
                    throw new Error("Category name is invalid");
                }

                idResult = await props.saveCategory(new Category(0, name.trim()));
                setCategories([...categories, new Category(idResult, name.trim())]);
            }
            toggleVisible(false);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Button onPress={() => toggleVisible(true)} style={props.buttonStyle}>
                <Text>Add something</Text>
            </Button>
            <Modal visible={visible} close={() => toggleVisible(false)}>
                <View style={styles.modal}>
                    <Button onPress={() => toggleVisible(false)} style={styles.closeButton}>
                        <Icon icon="xmark" size={20} />
                    </Button>
                    <Text style={styles.title}>
                        {mode === MODES.ITEM ? "Add Item" : mode === MODES.CATEGORY ? "Add Category" : "Choose mode"}
                    </Text>
                    {mode === MODES.ITEM ? (
                        <AddItemModalContent
                            name={name}
                            setName={setName}
                            categoryName={categoryName}
                            setCategoryName={setCategoryName}
                            categories={categories}
                        />
                    ) : mode === MODES.CATEGORY ? (
                        <AddCategoryModalContent name={name} setName={setName} />
                    ) : (
                        <ChooseModeContent setMode={setMode} categories={categories} />
                    )}
                    {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
                    {mode !== MODES.NONE && (
                        <Button onPress={handleSave} style={styles.saveButton}>
                            <Text>Save</Text>
                        </Button>
                    )}
                </View>
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
