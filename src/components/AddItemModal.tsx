import { StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Picker } from "@react-native-picker/picker";

import Modal from "./Modal";
import Button from "./Button";
import { Item } from "@/model/Item";
import { useEffect, useState } from "react";
import { Category } from "@/model/category";
import { fetchAllCategories } from "@/dataaccess/categoryRepository";

interface AddItemModalProps {
    visible: boolean;
    close: () => void;
    save: (category: Category, item?: Item) => Promise<number>;
}

const MODES = {
    NONE: "",
    ITEM: "item",
    CATEGORY: "category",
};

export default function AddItemModal(props: AddItemModalProps) {
    const [mode, setMode] = useState(MODES.NONE);
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [category, setCategory] = useState<Category>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAllCategories().then((categories) => setCategories(categories));
    }, []);
    useEffect(() => {
        if (!props.visible) return;
        setMode(MODES.NONE);
        setName("");
        setCategory(null);
        setError("");
    }, [props.visible]);

    const handleSave = async () => {
        setError("");
        let idResult: number;
        if (mode === MODES.ITEM) {
            if (!category) {
                setError("Category is required");
                return;
            } else if (!Item.isNameValid(name)) {
                setError("Name is required");
                return;
            }

            idResult = await props.save(category, new Item(0, name, 0));
        } else if (mode === MODES.CATEGORY) {
            if (!Category.isNameValid(name)) {
                setError("Name is required");
                return;
            }

            idResult = await props.save(new Category(0, name));
            if (idResult !== -1) {
                setCategories([...categories, new Category(idResult, name)]);
            }
        }
        if (idResult === -1) {
            setError(`Unhandled error occurred while saving the ${mode}`);
            return;
        }
    }

    return (
        <Modal visible={props.visible} close={props.close}>
            <View style={styles.modal}>
                <Button onPress={props.close} style={styles.closeButton}>
                    <FontAwesomeIcon icon={faXmark} size={20} />
                </Button>
                <Text style={styles.title}>
                    {mode === MODES.ITEM
                        ? "Add Item"
                        : mode === MODES.CATEGORY
                        ? "Add Category"
                        : "Choose mode"}
                </Text>
                {mode === MODES.ITEM ? (
                    <AddItemModalContent
                        name={name}
                        setName={setName}
                        category={category}
                        setCategory={setCategory}
                        categories={categories}
                    />
                ) : mode === MODES.CATEGORY ? (
                    <AddCategoryModalContent name={name} setName={setName}/>
                ) : (
                    <ChooseModeContent setMode={setMode} categories={categories} />
                )}
                {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
                { mode !== MODES.NONE && (
                    <Button
                        onPress={handleSave}
                        style={styles.saveButton}
                    >
                        <Text>Save</Text>
                    </Button>
                )}
            </View>
        </Modal>
    );
}

function ChooseModeContent({ setMode, categories }: { setMode: (mode: string) => void, categories: Category[] }) {
    return (
        <View style={styles.content}>
            {categories.length > 0 && (
                <Button onPress={() => setMode(MODES.ITEM)} style={styles.saveButton}>
                    <Text>Item</Text>
                </Button>
            )}
            <Button
                onPress={() => setMode(MODES.CATEGORY)}
                style={styles.saveButton}
            >
                <Text>Category</Text>
            </Button>
        </View>
    );
}
function AddItemModalContent({
    name,
    setName,
    category,
    setCategory,
    categories,
}: {
    name: string;
    setName: (name: string) => void;
    category: Category;
    setCategory: (category: Category) => void;
    categories: Category[];
}) {
    useEffect(() => {
        if (categories.length > 0) {
            setCategory(categories[0]);
        }
    }, [categories]);

    return (
        <View style={styles.content}>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Item name"
                style={styles.input}
            />
            <View style={styles.input}>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={styles.picker}
                >
                    {categories.map((category) => (
                        <Picker.Item key={category.name} label={category.name} value={category} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}
function AddCategoryModalContent({
    name,
    setName,
}: {
    name: string;
    setName: (name: string) => void;
}) {
    return (
        <View style={styles.content}>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Category name"
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        top: "35%",
        width: "70%",
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
    content: {
        width: "100%",
        alignItems: "center",
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
